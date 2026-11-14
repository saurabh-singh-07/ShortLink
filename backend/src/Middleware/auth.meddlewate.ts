import 'dotenv/config'
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access token required",
        });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid access token",
        });
    }

    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
        console.error("JWT_ACCESS_SECRET is not configured");

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

    try {
        const decoded = jwt.verify(token, secret);

        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string" ||
            !decoded.userId
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token payload",
            });
        }

        res.locals.userId = decoded.userId;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Access token expired",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid access token",
        });
    }
}
