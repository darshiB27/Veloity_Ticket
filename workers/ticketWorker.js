const { Worker } = require('bullmq');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

const redisConnection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
};

const ticketWorker = new Worker('ticketQueue', async (job) => {
    const { userId, eventId } = job.data;
    console.log(`🏭 Worker processing Job [${job.id}] for User ${userId}`);

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            throw new Error(`Event ${eventId} no longer exists.`);
        }
        if (event.availableTickets <= 0) {
            console.log(`🚫 Job [${job.id}] Failed: ${event.title} is sold out.`);
            return { status: 'failed', reason: 'Sold out' };
        }
        event.availableTickets -= 1;
        await event.save();
        
        const ticket = await Ticket.create({
            user: userId,
            event: eventId
        });

        console.log(`✅ Ticket successfully compiled for User ${userId} (Ticket ID: ${ticket._id})`);
        return { status: 'completed', ticketId: ticket._id };

    } catch (error) {
        console.error(`❌ Background processing crash on Job [${job.id}]: ${error.message}`);
        throw error;
    }
}, {
    connection: redisConnection,
    concurrency: 1
});

console.log('👷 Background Ticket Worker activated and polling Redis line...');

module.exports = ticketWorker;