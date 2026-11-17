import jwt from "jsonwebtoken";
import crypto from "crypto";
export const generateAccessToken = (userId) => {
    return jwt.sign({
        userId,
    }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m", });
};
export const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};
export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};
//# sourceMappingURL=token.js.map