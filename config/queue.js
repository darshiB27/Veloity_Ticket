const { Queue } = require('bullmq');

const redisConnection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
};

const ticketQueue = new Queue('ticketQueue', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    }
});

console.log('📦 BullMQ: Ticket pipeline queue cleanly initialized.');

module.exports = { ticketQueue };