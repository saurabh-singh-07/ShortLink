import redis from "../config/redis.js";
const CACHE_PREFIX = "url:redirect:";
const DEFAULT_TTL_SECONDS = 300;
export function getUrlCacheKey(shortCode) {
    return `${CACHE_PREFIX}${shortCode}`;
}
export async function getCachedUrl(shortCode) {
    try {
        const cached = await redis.get(getUrlCacheKey(shortCode));
        if (!cached)
            return null;
        const data = JSON.parse(cached);
        if (typeof data !== "object" ||
            data === null ||
            !("originalUrl" in data) ||
            typeof data.originalUrl !== "string" ||
            !("isActive" in data) ||
            typeof data.isActive !== "boolean" ||
            !("expiresAt" in data) ||
            !(typeof data.expiresAt === "string" || data.expiresAt === null)) {
            await redis.del(getUrlCacheKey(shortCode));
            return null;
        }
        return data;
    }
    catch (error) {
        console.error("Redis cache read error :", error);
        return null;
    }
}
export async function cacheUrl(shortCode, data) {
    let ttl = DEFAULT_TTL_SECONDS;
    if (data.expiresAt) {
        const remainingeconds = Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000);
        ttl = Math.min(ttl, remainingeconds);
    }
    if (ttl <= 0 || !data.isActive) {
        return;
    }
    try {
        await redis.set(getUrlCacheKey(shortCode), JSON.stringify(data), { EX: ttl });
    }
    catch (error) {
        console.error("Redis cache write error :", error);
    }
}
export async function invalidateUrlCache(shortCode) {
    try {
        await redis.del(getUrlCacheKey(shortCode));
    }
    catch (error) {
        console.error("Redis cache invalidation error:", error);
    }
}
//# sourceMappingURL=urlCache.js.map