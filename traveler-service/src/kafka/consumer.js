/**
 * Kafka Consumer for Traveler Service
 * Consumes booking status updates from Owner Service
 */
import { Kafka } from 'kafkajs';
import { KAFKA_CONFIG, TOPICS, CONSUMER_GROUPS } from '../../../shared/kafka-config.js';
import Booking from '../models/Booking.js';

const kafka = new Kafka(KAFKA_CONFIG);
const consumer = kafka.consumer({ groupId: CONSUMER_GROUPS.TRAVELER_SERVICE });

let isConnected = false;

/**
 * Start consuming booking responses
 */
export async function startConsumer() {
    try {
        if (isConnected) return;

        await consumer.connect();
        await consumer.subscribe({ topic: TOPICS.BOOKING_RESPONSES, fromBeginning: false });

        console.log('✅ Kafka Consumer started (Traveler Service)');
        isConnected = true;

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const messageValue = JSON.parse(message.value.toString());
                    console.log(`📥 Received booking response:`, messageValue);

                    const { bookingId, status, updatedBy } = messageValue;

                    // Update booking status in database
                    const booking = await Booking.findByIdAndUpdate(
                        bookingId,
                        {
                            status: status,
                            updatedAt: new Date(),
                        },
                        { new: true }
                    );

                    if (booking) {
                        console.log(`✅ Updated booking ${bookingId} to status: ${status}`);
                    } else {
                        console.warn(`⚠️  Booking not found: ${bookingId}`);
                    }
                } catch (error) {
                    console.error('❌ Error processing booking response:', error);
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
