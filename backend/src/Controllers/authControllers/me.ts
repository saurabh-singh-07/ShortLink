import { Request, Response } from "express";
import { pool } from "../../config/db";

export const getMe = async (req : Request , res : Response) => {
    try {
        const userId = res.locals.userId as string;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = await pool.query(
            `select id, name , email, avatar_url,is_email_verified, created_at
            from users
            where id = $1`,
            [userId]
        );

        if(result.rowCount === 0){
            return res.status(404).json({
                success : false,
                message : "User not found",
            })
        }

        return res.status(200).json({
            success : true,
            user : result.rows[0]
        })
    } catch (error) {
        console.error("Get me error :", error);

        return res.status(500).json({
            success : false,
            message : "Internel server error.."
        })
    }
}