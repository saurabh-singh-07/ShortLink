import { pool } from "../../config/db.js";
import { generateAccessToken, generateRefreshToken, hashToken, } from "../../utils/token.js";
const COOKIE_NAME = "refreshToken";
const REFRESH_TOKEN_DAYS = 30;
const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
};
export async function refreshSession(req, res) {
    const oldToken = req.cookies?.[COOKIE_NAME];
    if (!oldToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token required",
        });
    }
    const client = await pool.connect();
    try {
        await client.query("begin");
        const oldTokenHash = hashToken(oldToken);
        const revoked = await client.query(`
            UPDATE refresh_tokens
            SET revoked_at = NOW()
            WHERE token_hash = $1
            AND revoked_at IS NULL
            AND expires_at > NOW()
            RETURNING user_id`, [oldTokenHash]);
        if (revoked.rowCount !== 1) {
            await client.query("ROLLBACK");
            res.clearCookie(COOKIE_NAME, cookieOptions);
            return res.status(401).json({
                success: false,
                message: "Refresh token is invalid, expired or already used",
            });
        }
        const userId = revoked.rows[0].user_id;
        const userResult = await client.query(`SELECT id, name, email, avatar_url,
                    is_email_verified
            FROM users
            WHERE id = $1
            `, [userId]);
        if (userResult.rowCount !== 1) {
            await client.query("ROLLBACK");
            res.clearCookie(COOKIE_NAME, cookieOptions);
            return res.status(401).json({
                success: false,
                message: "user not found",
            });
        }
        const newRefreshToken = generateRefreshToken();
        const newRefreshTokenHash = hashToken(newRefreshToken);
        await client.query(`INSERT INTO refresh_tokens
            (user_id, token_hash, expires_at)
            VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 day')
            )`, [userId, newRefreshTokenHash, REFRESH_TOKEN_DAYS]);
        const accessToken = generateAccessToken(userId);
        await client.query("COMMIT");
        res.cookie(COOKIE_NAME, newRefreshToken, {
            ...cookieOptions,
            maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            accessToken,
            user: userResult.rows[0],
        });
    }
    catch (error) {
        try {
            await client.query("ROLLBACK");
        }
        catch (rollbackError) {
            console.error("Rollback failed:", rollbackError);
        }
        console.error("Refresh session error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=refreshSession.js.map