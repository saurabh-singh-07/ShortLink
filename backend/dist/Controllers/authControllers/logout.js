import { pool } from "../../config/db.js";
import { hashToken } from "../../utils/token.js";
export async function logout(req, res) {
    const refreahToken = req.cookies?.refreahToken;
    try {
        if (refreahToken) {
            await pool.query(`UPDATE refresh_tokens
                SET revoked_at = NOW()
                WHERE token_hash = $1
                AND revoked_at IS NULL`, [hashToken(refreahToken)]);
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        console.error("logout error :", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
export async function logoutAllSessions(req, res) {
    try {
        const userId = res.locals.userId;
        await pool.query(`UPDATE refresh_tokens
            SET revoked_at = NOW()
            WHERE user_id = $1
            AND revoked_at IS NULL`, [userId]);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });
        return res.status(200).json({
            success: true,
            message: "All sessions have been revoked",
        });
    }
    catch (error) {
        console.error("Logout all sessions erorr :", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
//# sourceMappingURL=logout.js.map