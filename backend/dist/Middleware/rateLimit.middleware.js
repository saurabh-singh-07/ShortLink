import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../config/redis';
export const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redis.sendCommand(args),
    }),
    message: {
        message: "Too many login attempts. Please try again later.",
    }
});
//# sourceMappingURL=rateLimit.middleware.js.map