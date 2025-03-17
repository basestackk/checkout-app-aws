import { Kafka } from 'kafkajs';
import * as fs from 'fs';

interface CartItem {
  cartId: string;
  sku: string;
  name: string;
  description: string;
}

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

async function sendCartItemsToKafka(): Promise<void> {
  try {
    const cartItems: CartItem[] = JSON.parse(fs.readFileSync('random_cart_items.json', 'utf8'));

    const kafka = new Kafka({
      clientId: 'cart-service',
      brokers: ['localhost:9092'],
    });

    const producer = kafka.producer();

    await producer.connect();
    console.log('Producer is connected and ready');

    for (const item of cartItems) {
      const result = await producer.send({
        topic: 'scan-item-events',
        messages: [
          { value: JSON.stringify(item) },
        ],
      });

      console.log('Message sent for cartId', item.cartId, result);
      await delay(50);
    }

    console.log('All messages sent to Kafka');
  } catch (error) {
    console.error('Error sending messages:', error);
  }
}

sendCartItemsToKafka().then(() => {
  console.log('Process completed.');
}).catch((err) => {
  console.error('Process failed:', err);
});
