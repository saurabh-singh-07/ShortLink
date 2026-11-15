import { Router } from "express";
import { startGoogleOAuth, googleCallback, exchangeGoogleTicket, } from "../Controllers/googleAuthController";
const router = Router();
router.get("/google", startGoogleOAuth);
router.get("/google/callback", googleCallback);
router.post("/google/exchange", exchangeGoogleTicket);
export default router;
//# sourceMappingURL=googleAuthRoute.js.map