/**
 * Redis Configuration & Distributed Locking
 * Handles race condition prevention with Redis
 */

const redis = require('redis');

let redisClient = null;

// Initialize Redis connection
const initRedis = async () => {
  try {
    // Build Redis URL with proper protocol
    let redisUrl = process.env.REDIS_URL;
    if (!redisUrl || !redisUrl.startsWith('redis://')) {
      // Construct from individual env vars if REDIS_URL is not a full URL
      const password = process.env.REDIS_PASSWORD || '';
      const host = process.env.REDIS_HOST || 'localhost';
      const port = process.env.REDIS_PORT || 6379;
      const db = process.env.REDIS_DB || 0;
      redisUrl = `redis://:${password}@${host}:${port}/${db}`;
    }
    
    redisClient = redis.createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✓ Redis connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw error;
  }
};

// Acquire distributed lock
const acquireLock = async (key, ttl = 30) => {
  try {
    if (!redisClient) {
      return true; // If Redis unavailable, allow operation (fallback)
    }

    const lockKey = `lock:${key}`;
    const lockValue = `${Date.now()}:${Math.random()}`;

    // Try to set lock with NX (only if not exists) and EX (expiry)
    const result = await redisClient.set(lockKey, lockValue, {
      NX: true,
      EX: ttl,
    });

    return result === 'OK' ? lockValue : null;
  } catch (error) {
    console.error('Lock acquisition error:', error);
    return null;
  }
};

// Release distributed lock
const releaseLock = async (key, lockValue) => {
  try {
    if (!redisClient) return true;

    const lockKey = `lock:${key}`;

    // Lua script to ensure only lock owner can release
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    const result = await redisClient.eval(script, {
      keys: [lockKey],
      arguments: [lockValue],
    });

    return result === 1;
  } catch (error) {
    console.error('Lock release error:', error);
    return false;
  }
};

// Idempotency Key Storage
const storeIdempotencyKey = async (idempotencyKey, result) => {
  try {
    if (!redisClient) return;
    const key = `idempotency:${idempotencyKey}`;
    await redisClient.setEx(key, 3600, JSON.stringify(result)); // 1 hour TTL
  } catch (error) {
    console.error('Idempotency storage error:', error);
  }
};

const getIdempotencyResult = async (idempotencyKey) => {
  try {
    if (!redisClient) return null;
    const key = `idempotency:${idempotencyKey}`;
    const result = await redisClient.get(key);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.error('Idempotency retrieval error:', error);
    return null;
  }
};

// Cache operations
const cacheSet = async (key, value, ttl = 3600) => {
  try {
    if (!redisClient) return;
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

const cacheGet = async (key) => {
  try {
    if (!redisClient) return null;
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

const cacheDel = async (key) => {
  try {
    if (!redisClient) return;
    await redisClient.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

module.exports = {
  initRedis,
  acquireLock,
  releaseLock,
  storeIdempotencyKey,
  getIdempotencyResult,
  cacheSet,
  cacheGet,
  cacheDel,
};
