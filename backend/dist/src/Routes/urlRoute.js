import { Router } from "express";
import { createShortUrl, getMyUrls, deleteShortUrl, } from "../Controllers/urlController.js";
import { authMiddleware } from "../Middleware/auth.meddlewate.js";
import { getUrlAnalytics } from "../Controllers/analyticsController.js";
const urlRouter = Router();
urlRouter.post("/", authMiddleware, createShortUrl);
urlRouter.get("/", authMiddleware, getMyUrls);
urlRouter.get("/:id/analytics", authMiddleware, getUrlAnalytics);
urlRouter.delete("/:id", authMiddleware, deleteShortUrl);
export default urlRouter;
//# sourceMappingURL=urlRoute.js.map