/**
 * Kafka Producer for Traveler Service
 * Publishes booking requests to Kafka
 */
import { Kafka } from 'kafkajs';
import { KAFKA_CONFIG, TOPICS } from '../../../shared/kafka-config.js';

const kafka = new Kafka(KAFKA_CONFIG);
const producer = kafka.producer();

let isConnected = false;

/**
 * Connect producer to Kafka
 */
export async function connectProducer() {
    if (!isConnected) {
        await producer.connect();
        isConnected = true;
        console.log('✅ Kafka Producer connected (Traveler Service)');
    }
}

/**
 * Publish booking request to Kafka
 * @param {Object} bookingData - Booking request data
 */
export async function publishBookingRequest(bookingData) {
    try {
        await connectProducer();

        const message = {
            key: bookingData._id.toString(),
            value: JSON.stringify({
                bookingId: bookingData._id.toString(),
                propertyId: bookingData.propertyId,
                travelerId: bookingData.travelerId.toString(),
                ownerId: bookingData.ownerId,
                checkInDate: bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate,
                guests: bookingData.guests,
                totalPrice: bookingData.totalPrice,
                timestamp: new Date().toISOString(),
            }),
        };

        await producer.send({
            topic: TOPICS.BOOKING_REQUESTS,
            messages: [message],
        });

        console.log(`📤 Published booking request: ${bookingData._id}`);
        return true;
    } catch (error) {
        console.error('❌ Error publishing booking request:', error);
        throw error;
    }
}

/**
 * Disconnect producer
 */
export async function disconnectProducer() {
    if (isConnected) {
        await producer.disconnect();
        isConnected = false;
        console.log('Kafka Producer disconnected');
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await disconnectProducer();
    process.exit(0);
});
