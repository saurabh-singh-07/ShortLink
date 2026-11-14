import express from 'express'
import {authMiddleware} from '../Middleware/auth.meddlewate'
import { getMe } from '../Controllers/authControllers/me';
import {refreshSession} from '../Controllers/authControllers/refreshSession'
import {logout, logoutAllSessions} from '../Controllers/authControllers/logout'
import { register } from '../Controllers/authControllers/register';
import { login } from '../Controllers/authControllers/login';
import {loginRateLimit} from '../Middleware/rateLimit.middleware'
const authRouter = express.Router();

authRouter.get("/me", authMiddleware, getMe)
authRouter.post('/refresh', refreshSession)
authRouter.post("/logout", logout)
authRouter.post("/logout-all",authMiddleware, logoutAllSessions)
authRouter.post("/register",register);
authRouter.post("/login",loginRateLimit, login)


export default authRouter;