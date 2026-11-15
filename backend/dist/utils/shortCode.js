import { randomBytes } from "node:crypto";
export function generateShortCode() {
    return randomBytes(6).toString("base64url").slice(0, 8);
}
//# sourceMappingURL=shortCode.js.map