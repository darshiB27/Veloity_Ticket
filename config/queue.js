const { Queue } = require('bullmq');
const { redisConfig } = require('./redis');

const redisConnection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
};

const ticketQueue = new Queue('ticketQueue', {
    connection: redisConfig,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 1000
        },
        removeOnComplete: true,
        removeOnFail: false
    }
});

const emailQueue = new Queue('emailQueue', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 5,              
        backoff: {
            type: 'exponential',
            delay: 2000            
        },
        removeOnComplete: true    
    }
});

console.log('📦 BullMQ: Ticket pipeline queue cleanly initialized.');

module.exports = { ticketQueue ,emailQueue };