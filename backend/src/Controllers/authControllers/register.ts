import { Request, Response } from "express";
import { pool } from "../../config/db";
import { hashPassword } from "../../utils/password";
import { generateAccessToken, generateRefreshToken, hashToken } from "../../utils/token";

export const register = async (req : Request, res : Response) => {
    try {
        const {name, email, password} = req.body;

        if(!email || !password || !name) {
            return res.status(400).json({
                message : "Name , email and password are required..."
            })
        }
        if(password.length < 8) {
            return res.status(400).json({
                message : "Password must be at least 8 characters.."
            })
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await pool.query(
            `select id from users where lower(email) = lower($1)`, [normalizedEmail]
        );
        if(existingUser.rows.length > 0){
            return res.status(409).json({
                message : "Email already registered..."
            })
        }
        const passwordHash = await hashPassword(password)

        const client = await pool.connect();
        try{
            await client.query("BEGIN");
            const userResult = await client.query(
                `INSERT INTO users
                (name, email, is_email_verified)
                VALUES ($1,$2, FALSE)
                RETURNING id,name,email`,
                [name.trim(), email.toLowerCase()]
            );
            const user = userResult.rows[0];

            await client.query(
                `
                INSERT INTO auth_accounts (
                user_id,provider, password_hash)
                VALUES ($1, 'local', $2)`,
                [user.id, passwordHash]
            );

            await client.query("COMMIT");

            const accessToken = generateAccessToken(user.id)
            const refreshToken = generateRefreshToken();
            const refreshTokenHash = hashToken(refreshToken);

            await pool.query(
                `INSERT INTO refresh_tokens (
                    user_id,
                    token_hash,
                    expires_at
                )
                VALUES ($1,$2,NOW() + INTERVAL '30 days' 
                )`,[user.id, refreshTokenHash]
            );

            res.cookie("refreshToken",refreshToken, {
                httpOnly : true,
                secure : process.env.NODE_ENV === 'production',
                sameSite :"lax",
                maxAge : 30 * 24 * 60 * 60 * 1000,
            })
            return res.status(201).json({
                message : "Registration successful",
                accessToken,
                user
            })
        }catch (error){
            await client.query("ROLLBACK");
            throw error;

        }
        finally{
            client.release();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message : "Server error"

        })
    }
}