const { Worker } = require('bullmq');
const path = require('path');
const ejs = require('ejs');
const mailTransporter = require('../config/mailer');
const redisConfig = require('../config/redis');

const emailWorker = new Worker('emailQueue', async (job) => {
    const { recipientEmail, eventName, ticketId } = job.data;

    if (process.env.NODE_ENV !== 'production') {
        console.log(`📬 Email-Worker draining Job [${job.id}] – Preparing template for ${recipientEmail}`);
    }

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
    connection: redisConfig,
    concurrency: 5
});

console.log('👷 Standalone Email Worker activated and listening for chained triggers...');

module.exports = emailWorker;