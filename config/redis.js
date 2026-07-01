const { createClient } = require('redis');

const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379
};

const redisClient = createClient({
    url: `redis://${redisConfig.host}:${redisConfig.port}`
});


redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('⚡ Redis Connected to RAM Cache...');
    } catch (error) {
        console.error(`❌ Redis Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { redisConfig, redisClient, connectRedis };