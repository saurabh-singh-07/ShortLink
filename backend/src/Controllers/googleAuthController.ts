import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { pool } from "../config/db";
import redis from "../config/redis";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/token";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
);

const STATE_COOKIE = "google_oauth_state";
const REFRESH_COOKIE = "refreshToken";

const frontendUrl = process.env.FRONTEND_URL;

const stateCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 10 * 60 * 1000,
  path: "/api/auth/google/callback",
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
};

function safeStateMatch(received: string, expected: string) {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);

  return a.length === b.length && timingSafeEqual(a, b);
}

// GET /api/auth/google
export async function startGoogleOAuth(req: Request, res: Response) {
  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_CALLBACK_URL
  ) {
    return res.status(500).json({
      success: false,
      message: "Google OAuth is not configured",
    });
  }

  const state = randomBytes(32).toString("hex");

  res.cookie(STATE_COOKIE, state, stateCookieOptions);

  const url = googleClient.generateAuthUrl({
    response_type: "code",
    scope: ["openid", "email", "profile"],
    state,
    prompt: "select_account",
  });

  return res.redirect(url);
}

// GET /api/auth/google/callback
export async function googleCallback(req: Request, res: Response) {
  if (!frontendUrl) {
    return res.status(500).send("FRONTEND_URL is not configured");
  }

  const clearStateCookie = () =>
    res.clearCookie(STATE_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/api/auth/google/callback",
    });

  const fail = () => {
    clearStateCookie();
    return res.redirect(`${frontendUrl}/login?error=google_oauth_failed`);
  };

  const client = await pool.connect();
  let committed = false;
  let refreshTokenHash: string | undefined;

  try {
    const code = req.query.code;
    const receivedState = req.query.state;
    const savedState = req.cookies?.[STATE_COOKIE];

    if (
      typeof code !== "string" ||
      typeof receivedState !== "string" ||
      typeof savedState !== "string" ||
      !safeStateMatch(receivedState, savedState)
    ) {
      return fail();
    }

    if (req.query.error) {
      return fail();
    }

    const { tokens } = await googleClient.getToken(code);

    if (!tokens.id_token) {
      return fail();
    }

    const ticketPayload = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const profile = ticketPayload.getPayload();

    if (!profile?.sub || !profile.email || profile.email_verified !== true) {
      return fail();
    }

    const googleId = profile.sub;
    const email = profile.email.trim().toLowerCase();
    const name = profile.name?.trim() || email;
    const avatarUrl = profile.picture || null;

    await client.query("BEGIN");

    // 1. Existing Google account?
    let userResult = await client.query(
      `SELECT u.id, u.name, u.email, u.avatar_url,
                    u.is_email_verified, u.created_at
             FROM users u
             JOIN auth_accounts a ON a.user_id = u.id
             WHERE a.provider = 'google'
               AND a.provider_account_id = $1
             FOR UPDATE OF u`,
      [googleId],
    );

    if (userResult.rowCount === 0) {
      // 2. Link an existing account with this verified email,
      // or create a new user.
      userResult = await client.query(
        `SELECT id, name, email, avatar_url,
                        is_email_verified, created_at
                 FROM users
                 WHERE LOWER(email) = $1
                 FOR UPDATE`,
        [email],
      );

      let userId: string;

      if (userResult.rowCount === 1) {
        userId = userResult.rows[0].id;

        await client.query(
          `INSERT INTO auth_accounts
                        (user_id, provider, provider_account_id)
                     VALUES ($1, 'google', $2)
                     ON CONFLICT (provider, provider_account_id)
                     WHERE provider_account_id IS NOT NULL
                     DO NOTHING`,
          [userId, googleId],
        );

        // Verify the Google account is linked to this user.
        const linked = await client.query(
          `SELECT user_id
                     FROM auth_accounts
                     WHERE provider = 'google'
                       AND provider_account_id = $1`,
          [googleId],
        );

        if (linked.rowCount !== 1 || linked.rows[0].user_id !== userId) {
          throw new Error("Google account linking conflict");
        }
      } else {
        const created = await client.query(
          `INSERT INTO users
                        (name, email, avatar_url, is_email_verified)
                     VALUES ($1, $2, $3, TRUE)
                     RETURNING id, name, email, avatar_url,
                               is_email_verified, created_at`,
          [name, email, avatarUrl],
        );

        userId = created.rows[0].id;

        await client.query(
          `INSERT INTO auth_accounts
                        (user_id, provider, provider_account_id)
                     VALUES ($1, 'google', $2)`,
          [userId, googleId],
        );

        userResult = created;
      }

      if (userResult.rowCount === 0) {
        userResult = await client.query(
          `SELECT id, name, email, avatar_url,
                            is_email_verified, created_at
                     FROM users WHERE id = $1`,
          [userId],
        );
      }
    }

    const user = userResult.rows[0];

    // 3. Create our application's refresh token.
    const refreshToken = generateRefreshToken();
    refreshTokenHash = hashToken(refreshToken);

    await client.query(
      `INSERT INTO refresh_tokens
                (user_id, token_hash, expires_at)
             VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, refreshTokenHash],
    );

    const accessToken = generateAccessToken(user.id);

    await client.query("COMMIT");
    committed = true;

    // 4. One-time ticket: expires in 60 seconds.
    const ticket = randomBytes(32).toString("hex");

    const stored = await redis.set(
      `oauth:google:ticket:${ticket}`,
      JSON.stringify({ accessToken, user }),
      { EX: 60, NX: true },
    );

    if (stored !== "OK") {
      throw new Error("Could not store Google login ticket");
    }

    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
    clearStateCookie();

    return res.redirect(`${frontendUrl}/oauth/callback?code=${ticket}`);
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
    }

    console.error("Google OAuth error:", error);

    if (committed && refreshTokenHash) {
      try {
        await pool.query(
          `UPDATE refresh_tokens
                     SET revoked_at = NOW()
                     WHERE token_hash = $1
                       AND revoked_at IS NULL`,
          [refreshTokenHash],
        );
      } catch (revokeError) {
        console.error("Refresh-token cleanup failed:", revokeError);
      }
    }

    clearStateCookie();

    return res.redirect(`${frontendUrl}/login?error=google_oauth_failed`);
  } finally {
    client.release();
  }
}

// POST /api/auth/google/exchange
export async function exchangeGoogleTicket(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store");

  const code = req.body?.code;

  if (typeof code !== "string" || !/^[a-f0-9]{64}$/.test(code)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing login code",
    });
  }

  try {
    // GETDEL makes the ticket single-use.
    const stored = await redis.getDel(`oauth:google:ticket:${code}`);

    if (!stored) {
      return res.status(401).json({
        success: false,
        message: "Login code expired or already used",
      });
    }

    const result = JSON.parse(stored) as {
      accessToken: string;
      user: {
        id: string;
        name: string;
        email: string;
        avatar_url: string | null;
        is_email_verified: boolean;
        created_at: string;
      };
    };

    return res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    console.error("Google ticket exchange error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
