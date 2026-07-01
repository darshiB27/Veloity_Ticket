const { Worker } = require('bullmq');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const mailTransporter = require('../config/mailer');
const path = require('path');
const ejs = require('ejs');

const redisConnection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
};

const ticketWorker = new Worker('ticketQueue', async (job) => {
    const { userId, eventId } = job.data;
    console.log(`🏭 Worker processing Job [${job.id}] for User ${userId}`);

    try {
        const existingTicket = await Ticket.findOne({ user: userId, event: eventId });
        if (existingTicket) {
            console.log(`⚠️ Idempotency Triggered: User ${userId} already has a ticket booked. Skipping job duplication.`);
            return { status: 'duplicate', ticketId: existingTicket._id };
        }

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

        const templatePath = path.join(__dirname, '../views/emails/ticketConfirmation.ejs');

        const htmlContent = await ejs.renderFile(templatePath, {
            eventName: event.title,
            ticketId: ticket._id
        });

        const mailOptions = {
            from: '"Velocity Ticket Gate" <noreply@velocityticket.com>',
            to: 'testuser@example.com', 
            subject: `🎟️ Ticket Confirmed: ${event.title}`,
            html: htmlContent 
        };

        const mailInfo = await mailTransporter.sendMail(mailOptions);
        console.log(`📨 Mail Delivered: Preview URL -> ${require('nodemailer').getTestMessageUrl(mailInfo)}`);


        // const mailOptions = {
        //     from: '"Velocity Ticket Gate" <noreply@velocityticket.com>',
        //     to: 'testuser@example.com',
        //     subject: `🎟️ Ticket Confirmed: ${event.title}`,
        //     text: `Hi there! Your order is secured. Your unique Ticket Registration ID is: ${ticket._id}. See you at the venue!`,
        //     html: `
        //         <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 500px;">
        //             <h2 style="color: #2b6cb0;">Order Confirmed! 🎟️</h2>
        //             <p>Your transaction has been processed securely via our automated queue.</p>
        //             <hr/>
        //             <p><strong>Event:</strong> ${event.title}</p>
        //             <p><strong>Ticket ID:</strong> <code style="background: #f7fafc; padding: 4px;">${ticket._id}</code></p>
        //             <hr/>
        //             <p style="font-size: 12px; color: #718096;">Thank you for booking with Velocity Ticket Engine.</p>
        //         </div>
        //     `
        // };

        return { status: 'completed', ticketId: ticket._id };

    } catch (error) {
        console.error(`❌ Background processing crash on Job [${job.id}]: ${error.message}`);
        throw error;
    }
}, {
    connection: redisConnection,
    concurrency: 1 
});

module.exports = ticketWorker;