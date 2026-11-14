
import { Request, Response } from "express";
import QRCode from "qrcode";
import { pool } from "../config/db";

export const generateQrCode = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = res.locals.userId;
        const { url } = req.body;

        if (!url) {
            res.status(400).json({
                success: false,
                message: "Original URL is required",
            });
            return;
        }

        // Validate URL
        let originalUrl: URL;

        try {
            originalUrl = new URL(url);

            if (!["http:", "https:"].includes(originalUrl.protocol)) {
                throw new Error("Invalid protocol");
            }
        } catch {
            res.status(400).json({
                success: false,
                message: "Please provide a valid URL",
            });
            return;
        }

        // Generate QR code for original URL
        const qrDataUrl = await QRCode.toDataURL(
            originalUrl.toString(),
            {
                errorCorrectionLevel: "H",
                type: "image/png",
                width: 400,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#ffffff",
                },
            }
        );

        // Save QR code in database
        const qrResult = await pool.query(
            `INSERT INTO qr_codes (user_id, original_url)
             VALUES ($1, $2)
             RETURNING id, original_url, created_at`,
            [userId, originalUrl.toString()]
        );

        res.status(201).json({
            success: true,
            message: "QR code generated successfully",
            qrCode: {
                id: qrResult.rows[0].id,
                originalUrl: qrResult.rows[0].original_url,
                image: qrDataUrl,
                createdAt: qrResult.rows[0].created_at,
            },
        });

    } catch (error) {
        console.error("QR generation error", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate QR code",
        });
    }
};


export const getMyQrCodes = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = res.locals.userId;

        const result = await pool.query(
            `SELECT id, original_url, created_at
             FROM qr_codes
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        const qrCodes = result.rows.map((qr) => ({
            id: qr.id,
            originalUrl: qr.original_url,
            createdAt: qr.created_at,
        }));

        res.status(200).json({
            success: true,
            count: qrCodes.length,
            qrCodes,
        });

    } catch (error) {
        console.error("Get QR codes error", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch QR codes",
        });
    }
};
