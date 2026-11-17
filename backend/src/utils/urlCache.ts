import redis from "../config/redis.js";

const CACHE_PREFIX = "url:redirect:";
const DEFAULT_TTL_SECONDS = 300;

export interface CachedUrl {
    id : string,
    originalUrl : string;
    isActive : boolean;
    expiresAt : string | null ;
}

export function getUrlCacheKey(shortCode : string) : string {
    return `${CACHE_PREFIX}${shortCode}`;

}

export async function getCachedUrl (shortCode : string): Promise<CachedUrl | null> {
    try {
        const cached = await redis.get<unknown>(shortCode);
if (!cached) return null;
const data: unknown = typeof cached === "string" ? JSON.parse(cached) : cached;

        if(typeof data !== "object" || 
            data === null || 
            !("originalUrl" in data) ||
            typeof data.originalUrl !== "string" || 
            !("isActive" in data) ||
            typeof data.isActive !== "boolean" || 
            !("expiresAt" in data) ||
            !(typeof data.expiresAt === "string" || data.expiresAt === null)
        ){
            await redis.del(getUrlCacheKey(shortCode));
            return null;
        }
        return data as CachedUrl;
    } catch (error) {
        console.error("Redis cache read error :" , error);
        return null;
        
    }
}

export async function cacheUrl (
    shortCode : string,
    data : CachedUrl
) : Promise<void> {
    let ttl = DEFAULT_TTL_SECONDS;
    if(data.expiresAt){
        const remainingeconds = Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000)
        ttl = Math.min(ttl, remainingeconds);

    }
    if(ttl <= 0 || !data.isActive){
        return;
    }

    try {
        await redis.set(getUrlCacheKey(shortCode),
        JSON.stringify(data),
{ ex: ttl }    )
    } catch (error) {
        console.error("Redis cache write error :" , error);
    }
}

export async function invalidateUrlCache(shortCode : string) : Promise<void> {
    try {
        await redis.del(getUrlCacheKey(shortCode));
    } catch (error) {
        console.error("Redis cache invalidation error:", error);
        
    }
}