import { Router } from "express";
import { generateQrCode, getMyQrCodes } from "../Controllers/qrController";
import { authMiddleware } from "../Middleware/auth.meddlewate";
const qrRouter = Router();
qrRouter.post("/generate", authMiddleware, generateQrCode);
qrRouter.get("/", authMiddleware, getMyQrCodes);
export default qrRouter;
//# sourceMappingURL=qrRoutes.js.map