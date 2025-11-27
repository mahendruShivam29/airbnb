const http = require('http');

// Helper function to make HTTP requests
function request(method, port, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : '';

        const options = {
            hostname: 'localhost',
            port: port,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsedData = data ? JSON.parse(data) : {};
                    resolve({ statusCode: res.statusCode, data: parsedData });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (payload) {
            req.write(payload);
        }
        req.end();
    });
}

async function runE2ETest() {
    const timestamp = Date.now();
    const travelerEmail = `traveler${timestamp}@test.com`;
    const ownerEmail = `owner${timestamp}@test.com`;
    const password = 'password123';

    console.log('🚀 Starting End-to-End Test Suite\n');

    try {
        // 1. Signup Traveler
        console.log('1️⃣  Registering Traveler...');
        const travelerSignup = await request('POST', 4001, '/api/traveler/auth/signup', {
            email: travelerEmail,
            password: password,
            firstName: 'Test',
            lastName: 'Traveler',
            role: 'TRAVELER'
        });

        if (travelerSignup.statusCode !== 201) throw new Error(`Traveler signup failed: ${JSON.stringify(travelerSignup.data)}`);
        const travelerToken = travelerSignup.data.token;
        console.log(`   ✅ Traveler registered: ${travelerEmail}`);

        // 2. Signup Owner
        console.log('\n2️⃣  Registering Owner...');
        const ownerSignup = await request('POST', 4003, '/api/owner/auth/signup', {
            email: ownerEmail,
            password: password,
            firstName: 'Test',
            lastName: 'Owner',
            role: 'OWNER'
        });

        if (ownerSignup.statusCode !== 201) throw new Error(`Owner signup failed: ${JSON.stringify(ownerSignup.data)}`);
        const ownerToken = ownerSignup.data.token;
        console.log(`   ✅ Owner registered: ${ownerEmail}`);

        // 3. Create Property (as Owner)
        console.log('\n3️⃣  Creating Property...');
        const propertyData = {
            name: `Test Villa ${timestamp}`,
            description: 'A beautiful test villa',
            address: '123 Test St',
            city: 'Test City',
            state: 'TS',
            country: 'Testland',
            pricePerNight: 100,
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 1,
            amenities: ['Wifi', 'Pool']
        };

        const createProperty = await request('POST', 4002, '/api/properties', propertyData, ownerToken);

        if (createProperty.statusCode !== 201) throw new Error(`Create property failed: ${JSON.stringify(createProperty.data)}`);
        const propertyId = createProperty.data.property.id;
        console.log(`   ✅ Property created: ${propertyId}`);

        // 4. Book Property (as Traveler)
        console.log('\n4️⃣  Booking Property...');
        // Dates: Tomorrow to Day After Tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);

        const bookingData = {
            propertyId: propertyId,
            checkInDate: tomorrow.toISOString().split('T')[0],
            checkOutDate: dayAfter.toISOString().split('T')[0],
            guests: 2
        };

        const createBooking = await request('POST', 4001, '/api/traveler/bookings', bookingData, travelerToken);

        if (createBooking.statusCode !== 201) throw new Error(`Booking failed: ${JSON.stringify(createBooking.data)}`);
        const bookingId = createBooking.data.booking._id;
        console.log(`   ✅ Booking created: ${bookingId}`);
        console.log(`   💰 Total Price: $${createBooking.data.booking.totalPrice}`);

        console.log('\n🎉 E2E TEST PASSED SUCCESSFULLY!');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
    }
}

runE2ETest();
