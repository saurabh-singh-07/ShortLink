import express from 'express';
import { authMiddleware } from '../Middleware/auth.meddlewate.js';
import { getMe } from '../Controllers/authControllers/me.js';
import { refreshSession } from '../Controllers/authControllers/refreshSession.js';
import { logout, logoutAllSessions } from '../Controllers/authControllers/logout.js';
import { register } from '../Controllers/authControllers/register.js';
import { login } from '../Controllers/authControllers/login.js';
import { loginRateLimit } from '../Middleware/rateLimit.middleware.js';
const authRouter = express.Router();
authRouter.get("/me", authMiddleware, getMe);
authRouter.post('/refresh', refreshSession);
authRouter.post("/logout", logout);
authRouter.post("/logout-all", authMiddleware, logoutAllSessions);
authRouter.post("/register", register);
authRouter.post("/login", loginRateLimit, login);
export default authRouter;
//# sourceMappingURL=authRoute.js.map