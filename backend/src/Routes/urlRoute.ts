
import { Router } from "express";
import {
    createShortUrl,
    getMyUrls,
    deleteShortUrl,
} from "../Controllers/urlController";

import { authMiddleware } from "../Middleware/auth.meddlewate";
import { getUrlAnalytics } from "../Controllers/analyticsController";

const urlRouter = Router();

urlRouter.post("/", authMiddleware, createShortUrl);
urlRouter.get("/", authMiddleware, getMyUrls);
urlRouter.get("/:id/analytics", authMiddleware, getUrlAnalytics)
urlRouter.delete("/:id", authMiddleware, deleteShortUrl);

export default urlRouter;
