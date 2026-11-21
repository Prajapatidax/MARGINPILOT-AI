import json
from typing import Optional, Any
from app.core.config import settings

class CacheService:
    """
    Unified caching service supporting Upstash Redis via TLS (rediss://)
    and Upstash REST API with in-memory fallback.
    """
    def __init__(self):
        self.client = None
        self.mode = "memory"
        self._memory_cache = {}

        # 1. Check for Upstash REST credentials
        if settings.UPSTASH_REDIS_REST_URL and settings.UPSTASH_REDIS_REST_TOKEN:
            try:
                from upstash_redis import Redis
                self.client = Redis(url=settings.UPSTASH_REDIS_REST_URL, token=settings.UPSTASH_REDIS_REST_TOKEN)
                self.mode = "upstash_rest"
            except Exception as e:
                print(f"Upstash REST client initialization warning: {e}")

        # 2. Check for standard Redis / Upstash TLS connection string (rediss://)
        elif settings.REDIS_URL:
            try:
                import redis
                self.client = redis.from_url(settings.REDIS_URL, decode_responses=True)
                self.mode = "redis"
            except Exception as e:
                print(f"Redis client initialization warning: {e}")

    def get(self, key: str) -> Optional[Any]:
        try:
            if self.mode in ("upstash_rest", "redis") and self.client:
                val = self.client.get(key)
                return json.loads(val) if val else None
            return self._memory_cache.get(key)
        except Exception:
            return None

    def set(self, key: str, value: Any, ex: int = 3600) -> bool:
        try:
            val_str = json.dumps(value)
            if self.mode in ("upstash_rest", "redis") and self.client:
                self.client.set(key, val_str, ex=ex)
            else:
                self._memory_cache[key] = value
            return True
        except Exception:
            return False

    def delete(self, key: str) -> bool:
        try:
            if self.mode in ("upstash_rest", "redis") and self.client:
                self.client.delete(key)
            else:
                self._memory_cache.pop(key, None)
            return True
        except Exception:
            return False

cache_service = CacheService()
