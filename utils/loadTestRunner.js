const autocannon = require('autocannon');
const mongoose = require('mongoose');

const generateMockId = () => {
    const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return timestamp + randomHex;
};

const runDynamicLoadTest = () => {
    const targetEventId = "6a450fb952948c9ec14b8e3f"; 

    console.log('🚀 Setting up dynamic, multi-user high-concurrency stream...');

    const instance = autocannon({
        url: 'http://localhost:8080/api/tickets/book',
        connections: 200,     
        duration: 5,      
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },

        setupClient: (client) => {
            const randomUserId = generateMockId(); 
            client.setBody(JSON.stringify({
                userId: randomUserId,
                eventId: targetEventId
            }));
            return client;
        }
    }, (err, result) => {
        if (err) {
            console.error(`❌ Load Runner Error: ${err.message}`);
        } else {
            console.log('📊 Autocannon High-Concurrency Simulation Complete!');
            console.log(`✨ Total Requests Sent: ${result.requests.sent}`);
            console.log(`✅ Total Successful 202 Staging Responses: ${result['2xx']}`);
        }
    });

    autocannon.track(instance, { render: true });
};

runDynamicLoadTest();