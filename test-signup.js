const http = require('http');

// Test data
const payload = JSON.stringify({
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: 'TRAVELER'
});

const options = {
    hostname: 'localhost',
    port: 4001, // Traveler Service
    path: '/api/traveler/auth/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

console.log('🧪 Testing Signup API directly...');
console.log(`Target: http://${options.hostname}:${options.port}${options.path}`);
console.log('Payload:', payload);

const req = http.request(options, (res) => {
    console.log(`\nStatus Code: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:', data);
        if (res.statusCode === 201) {
            console.log('\n✅ Backend Signup is WORKING!');
        } else {
            console.log('\n❌ Backend Signup FAILED.');
        }
    });
});

req.on('error', (error) => {
    console.error('\n❌ Connection Error:', error.message);
    console.log('Make sure Traveler Service is running on port 4001');
});

req.write(payload);
req.end();
