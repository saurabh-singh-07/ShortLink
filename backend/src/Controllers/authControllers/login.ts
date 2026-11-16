import { Request, Response } from "express";
import { pool } from "../../config/db.js";
import { comparePassword } from "../../utils/password.js";
import { generateAccessToken, generateRefreshToken, hashToken } from "../../utils/token.js";

export const login = async (req : Request, res : Response) => {
    try {
        const {email , password} = req.body;

    if(!email || !password){
        return res.status(401).json({
            message : "email and password required to login..."
        })
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
        `SELECT 
            u.id,
            u.name,
            u.email,
            u.avatar_url,
            u.is_email_verified,
            a.password_hash
        FROM users u
        INNER JOIN auth_accounts a
            ON u.id = a.user_id
        WHERE LOWER(u.email) = LOWER($1)
        AND a.provider = 'local'
        `,[normalizedEmail]
    );

    if(result.rows.length === 0){
        return res.status(401).json ({
            message : "NO User Found...."
        })
    }

    const user = result.rows[0];

    const checkPassword = await comparePassword(password,user.password_hash);

    if(!checkPassword){
        return res.status(401).json({
            message : "Wrong Password, please check your password..."
        })
    }
    delete user.password_hash;

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();
    const refreahTokenHash = hashToken(refreshToken)
    
    await pool.query(
        `
        INSERT INTO refresh_tokens(
        user_id,
        token_hash,
        expires_at
        ) VALUES ($1,$2, NOW() + INTERVAL '30 days')
        `,[user.id, refreahTokenHash]
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : "lax",
        maxAge : 30 * 24 * 60 * 60 * 1000,
    })

    delete user.password_hash;

    return res.status(200).json({
        message : "Login successful",
        accessToken,
        user,
    })
    } catch (error) {
        console.error("Login error :", error);
        
        return res.status(500).json({
            message : "Internal server error"
        })
    }

}