import { Router } from "express";
import { generateQrCode, getMyQrCodes } from "../Controllers/qrController.js";
import { authMiddleware } from "../Middleware/auth.meddlewate.js";
const qrRouter = Router();

qrRouter.post("/generate", authMiddleware, generateQrCode);

qrRouter.get("/", authMiddleware, getMyQrCodes);

export default qrRouter;
