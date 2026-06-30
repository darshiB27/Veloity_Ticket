const nodemailer = require('nodemailer');

const initializeMailer = async () => {
    let testAccount;
    
    try {
        testAccount = await nodemailer.createTestAccount();
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user, 
                pass: testAccount.pass  
            }
        });

        console.log('📧 Nodemailer: Dynamic Ethereal Sandbox Account generated successfully.');
        console.log(`🔑 Account User: ${testAccount.user}`);
        
        return transporter;
    } catch (error) {
        console.error(`❌ Mail Engine Initialization Crash: ${error.message}`);
        throw error;
    }
};

let mailTransporter = {
    sendMail: async (...args) => {
        const activeTransporter = await transporterPromise;
        return activeTransporter.sendMail(...args);
    }
};

const transporterPromise = initializeMailer();

module.exports = mailTransporter;