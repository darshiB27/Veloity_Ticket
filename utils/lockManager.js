const { redisClient } = require('../config/redis');

const acquireLock = async (resourceId, ttl = 2000) => {
    const lockKey = `lock:event:${resourceId}`;
    
    try {
        const acquired = await redisClient.set(lockKey, 'locked', {
            PX: ttl,
            NX: true
        });

        return acquired === 'OK';
    } catch (error) {
        console.error(`❌ Redis Lock Acquisition Failed: ${error.message}`);
        return false;
    }
};

const releaseLock = async (resourceId) => {
    const lockKey = `lock:event:${resourceId}`;
    try {
        await redisClient.del(lockKey);
    } catch (error) {
        console.error(`❌ Redis Lock Release Failed: ${error.message}`);
    }
};

module.exports = {
    acquireLock,
    releaseLock
};