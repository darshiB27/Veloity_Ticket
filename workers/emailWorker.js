const { Worker } = require('bullmq');
const path = require('path');
const ejs = require('ejs');
const mailTransporter = require('../config/mailer');

const redisConnection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
};

const emailWorker = new Worker('emailQueue', async (job) => {
    const { recipientEmail, eventName, ticketId } = job.data;
    console.log(`📬 Email-Worker draining Job [${job.id}] – Preparing template for ${recipientEmail}`);

    try {
        const templatePath = path.join(__dirname, '../views/emails/ticketConfirmation.ejs');

        const htmlContent = await ejs.renderFile(templatePath, {
            eventName,
            ticketId
        });

        const mailOptions = {
            from: '"Velocity Ticket Gate" <noreply@velocityticket.com>',
            to: recipientEmail,
            subject: `🎟️ Transaction Confirmed: ${eventName}`,
            html: htmlContent
        };

        const mailInfo = await mailTransporter.sendMail(mailOptions);
        console.log(`📨 Mail successfully dispatched! Sandbox Preview URL -> ${require('nodemailer').getTestMessageUrl(mailInfo)}`);

        return { success: true };

    } catch (error) {
        console.error(`❌ Email-Worker Delivery Crash on Job [${job.id}]: ${error.message}`);
        throw error; 
    }
}, {
    connection: redisConnection,
    concurrency: 5
});

console.log('👷 Standalone Email Worker activated and listening for chained triggers...');

module.exports = emailWorker;