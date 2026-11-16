
import { Request, Response } from "express";
import { URL } from "url";
import { UAParser } from "ua-parser-js";

import { pool } from "../config/db.js";
import { generateShortCode } from "../utils/shortCode.js";
import {
    cacheUrl,
    getCachedUrl,
    invalidateUrlCache,
} from "../utils/urlCache.js";

function isValidHttpUrl(value: string): boolean {
    try {
        const url = new URL(value);

        return (
            (url.protocol === "http:" || url.protocol === "https:") &&
            Boolean(url.hostname)
        );
    } catch {
        return false;
    }
}

// CREATE SHORT URL
export async function createShortUrl(req: Request, res: Response) {
    const userId = res.locals.userId as string;
    const { originalUrl, title, expiredAt } = req.body;

    if (
        typeof originalUrl !== "string" ||
        !isValidHttpUrl(originalUrl.trim())
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid HTTP or HTTPS URL",
        });
    }

    const normalizedUrl = originalUrl.trim();

    if (normalizedUrl.length > 2048) {
        return res.status(400).json({
            success: false,
            message: "URL cannot exceed 2048 characters",
        });
    }

    if (
        title !== undefined &&
        (typeof title !== "string" || title.trim().length > 200)
    ) {
        return res.status(400).json({
            success: false,
            message: "Title must be a string of at most 200 characters",
        });
    }

    let expiration: Date | null = null;

    if (expiredAt !== undefined && expiredAt !== null && expiredAt !== "") {
        if (typeof expiredAt !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid expiration date",
            });
        }

        expiration = new Date(expiredAt);

        if (
            Number.isNaN(expiration.getTime()) ||
            expiration.getTime() <= Date.now()
        ) {
            return res.status(400).json({
                success: false,
                message: "Expiration must be a valid future date",
            });
        }
    }

    for (let attempt = 0; attempt < 3; attempt++) {
        const client = await pool.connect();

        try {
            const shortCode = generateShortCode();

            const result = await client.query(
                `INSERT INTO urls
                    (user_id, short_code, original_url, title, expires_at)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (short_code) DO NOTHING
                 RETURNING id, short_code, original_url, title,
                           is_active, expires_at, created_at`,
                [
                    userId,
                    shortCode,
                    normalizedUrl,
                    typeof title === "string" ? title.trim() || null : null,
                    expiration,
                ]
            );

            if (result.rowCount === 0) {
                continue;
            }

            const url = result.rows[0];

            const baseUrl = (
                process.env.BACKEND_PUBLIC_URL ||
                `http://localhost:${process.env.PORT || 3000}`
            ).replace(/\/+$/, "");

            return res.status(201).json({
                success: true,
                message: "Short URL created successfully",
                url: {
                    ...url,
                    shortUrl: `${baseUrl}/${url.short_code}`,
                },
            });

        } catch (error) {
            console.error("Create short URL error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to create short URL",
            });

        } finally {
            client.release();
        }
    }

    return res.status(503).json({
        success: false,
        message: "Could not generate a unique short code. Try again.",
    });
}


// GET MY URLS
export async function getMyUrls(req: Request, res: Response) {
    try {
        const userId = res.locals.userId as string;

        const result = await pool.query(
            `SELECT id, short_code, original_url, title,
                    is_active, expires_at, created_at
             FROM urls
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        const baseUrl = (
            process.env.BACKEND_PUBLIC_URL ||
            `http://localhost:${process.env.PORT || 3000}`
        ).replace(/\/+$/, "");

        return res.status(200).json({
            success: true,
            urls: result.rows.map((url) => ({
                ...url,
                shortUrl: `${baseUrl}/${url.short_code}`,
            })),
        });

    } catch (error) {
        console.error("Get URLs error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch URLs",
        });
    }
}


// DELETE SHORT URL
export async function deleteShortUrl(req: Request, res: Response) {
    const userId = res.locals.userId as string;
    const { id } = req.params;

    if (
        typeof id !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid URL ID",
        });
    }

    try {
        const result = await pool.query(
            `DELETE FROM urls
             WHERE id = $1 AND user_id = $2
             RETURNING short_code`,
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "URL not found",
            });
        }

        // Invalidate Redis cache
        await invalidateUrlCache(result.rows[0].short_code);

        return res.status(200).json({
            success: true,
            message: "URL deleted successfully",
        });

    } catch (error) {
        console.error("Delete URL error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete URL",
        });
    }
}

export const redirectShortUrl = async (
  req: Request,
  res: Response
) => {
  try {
    const { shortCode } = req.params;

    if (typeof shortCode !== "string") {
    return res.status(400).json({
        success: false,
        message: "Invalid short code"
    });
}


    let url = await getCachedUrl(shortCode);

    if (!url) {

      const result = await pool.query(
        `SELECT id, original_url, is_active, expires_at
         FROM urls
         WHERE short_code = $1`,
        [shortCode]
      );

      if (result.rows.length === 0) {
        return res.status(404).send("Short URL not found");
      }

      const row = result.rows[0];

      url = {
        id: row.id,
        originalUrl: row.original_url,
        isActive: row.is_active,
        expiresAt: row.expires_at,
      };

      await cacheUrl(shortCode, url);
    }
    if (!url.isActive) {
      return res.status(410).send("This URL is inactive");
    }

    if (url.expiresAt && new Date(url.expiresAt) <= new Date()) {
      return res.status(410).send("This URL has expired");
    }

    const userAgent = req.get("user-agent") || "";
    const parser = new UAParser(userAgent);

    const device = parser.getDevice();
    const browser = parser.getBrowser();
    const os = parser.getOS();


    // Save click event
    const clickResult = await pool.query(
      `INSERT INTO click_events
       (url_id, referrer, user_agent, device_type, browser, operating_system)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        url.id,
        req.get("referer") || null,
        userAgent,
        device.type || "desktop",
        browser.name || "Unknown",
        os.name || "Unknown",
      ]
    );
    return res.redirect(302, url.originalUrl);

  } catch (error) {
    console.error("REDIRECT ERROR:", error);
    return res.status(500).send("Something went wrong");
  }
};
