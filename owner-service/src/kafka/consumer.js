/**
 * Kafka Consumer for Owner Service
 * Consumes booking requests from Traveler Service
 */
import { Kafka } from 'kafkajs';
import { KAFKA_CONFIG, TOPICS, CONSUMER_GROUPS } from '../../../shared/kafka-config.js';
import Booking from '../models/Booking.js';

const kafka = new Kafka(KAFKA_CONFIG);
const consumer = kafka.consumer({ groupId: CONSUMER_GROUPS.OWNER_SERVICE });

let isConnected = false;

/**
 * Start consuming booking requests
 */
export async function startConsumer() {
    try {
        if (isConnected) return;

        await consumer.connect();
        await consumer.subscribe({ topic: TOPICS.BOOKING_REQUESTS, fromBeginning: false });

        console.log('✅ Kafka Consumer started (Owner Service)');
        isConnected = true;

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const bookingRequest = JSON.parse(message.value.toString());
                    console.log(`📥 Received booking request:`, bookingRequest);

                    const {
                        bookingId,
                        propertyId,
                        travelerId,
                        ownerId,
                        checkInDate,
                        checkOutDate,
                        guests,
                        totalPrice,
                    } = bookingRequest;

                    // Check if booking already exists
                    const existingBooking = await Booking.findOne({ bookingId });
                    if (existingBooking) {
                        console.log(`⚠️  Booking already exists: ${bookingId}`);
                        return;
                    }

                    // Create booking in owner's database
                    const booking = new Booking({
                        bookingId,
                        propertyId,
                        travelerId,
                        ownerId,
                        checkInDate,
                        checkOutDate,
                        guests,
                        totalPrice,
                        status: 'PENDING',
                    });

                    await booking.save();
                    console.log(`✅ Booking request saved: ${bookingId}`);
                } catch (error) {
                    console.error('❌ Error processing booking request:', error);
                }
            },
        });
    } catch (error) {
        console.error('❌ Kafka Consumer error:', error);
    }
}

/**
 * Stop consumer
 */
export async function stopConsumer() {
    if (isConnected) {
        await consumer.disconnect();
        isConnected = false;
        console.log('Kafka Consumer disconnected');
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await stopConsumer();
    process.exit(0);
});
