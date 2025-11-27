/**
 * Kafka Producer for Owner Service
 * Publishes booking responses to Kafka
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
        console.log('✅ Kafka Producer connected (Owner Service)');
    }
}

/**
 * Publish booking response to Kafka
 * @param {Object} responseData - Booking response data
 */
export async function publishBookingResponse(responseData) {
    try {
        await connectProducer();

        const message = {
            key: responseData.bookingId,
            value: JSON.stringify({
                bookingId: responseData.bookingId,
                status: responseData.status,
                updatedBy: responseData.ownerId,
                timestamp: new Date().toISOString(),
            }),
        };

        await producer.send({
            topic: TOPICS.BOOKING_RESPONSES,
            messages: [message],
        });

        console.log(`📤 Published booking response: ${responseData.bookingId} - ${responseData.status}`);
        return true;
    } catch (error) {
        console.error('❌ Error publishing booking response:', error);
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
