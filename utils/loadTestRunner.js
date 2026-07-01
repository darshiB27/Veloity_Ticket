const autocannon = require('autocannon');
const crypto = require('crypto');

const generateMockId = () => crypto.randomBytes(12).toString('hex');

const runDynamicLoadTest = () => {
    console.log('🚀 Setting up dynamic, multi-user high-concurrency stream...');

    const instance = autocannon({
        url: 'http://localhost:8080/api/tickets/book',
        connections: 500,    
        duration: 10,       
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        setupClient: (client) => {
            client.setBody(JSON.stringify({
                userId: generateMockId(),
                eventId: "<enter valid event id>" 
            }));
            return client;
        }
    }, (err, result) => {
        if (err) {
            console.error(`❌ Load Runner Error: ${err.message}`);
        } else {
            console.log('\n📊 Autocannon High-Concurrency Simulation Complete!');
            console.log(`✨ Total Requests Sent: ${result.requests.sent}`);
            console.log(`✅ Total Successful 202 Staging Responses: ${result['2xx']}`);
        }
    });

    autocannon.track(instance, { render: true });
};

runDynamicLoadTest();