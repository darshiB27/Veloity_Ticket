const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL
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

module.exports = { connectRedis, redisClient };