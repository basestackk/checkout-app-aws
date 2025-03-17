import { Kafka } from "kafkajs";
import AWS from "aws-sdk";
import { MessageService } from "../../../ipc";
import type { CartItem } from "../../cart/models/domain";
import * as dotenv from "dotenv";

const kafka = new Kafka({
  brokers: ["kafka1:29092", "kafka2:29093"],
  clientId: "cart-service-consumer",
});

const consumer = kafka.consumer({ groupId: "cart-service-consumer-group" });
let batch: Array<any> = [];
const BATCH_SIZE = 20;
const BATCH_TIMEOUT = 5000;

const waitForKafka = async (
  brokers: Array<string>,
  timeout = BATCH_TIMEOUT,
): Promise<void> => {
  const start = Date.now();

  const checkBroker = async (broker: string) => {
    try {
      await kafka.admin().connect();
      console.log(`Connected to Kafka broker: ${broker}`);
    } catch (err) {
      console.log(`Failed to connect to Kafka broker: ${broker}. Retrying...`);
      throw err;
    }
  };

  while (Date.now() - start < timeout) {
    try {
      await Promise.all(brokers.map(checkBroker));
      console.log("All Kafka brokers are up and running.");
      return;
    } catch (err) {
      if (Date.now() - start >= timeout) {
        throw new Error("Timed out while waiting for Kafka to be available.");
      }
      console.log("Kafka is not yet ready. Retrying...", err);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

const runConsumer = async (): Promise<void> => {
  await waitForKafka(["kafka1:29092", "kafka2:29093"]);

  await consumer.connect();
  await consumer.subscribe({ topic: "scan-item-events", fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `Consumed message from Kafka: ${message.value?.toString()}, ${topic}, ${partition}`,
      );

      batch.push(JSON.parse(message.value?.toString() ?? ""));

      if (batch.length >= BATCH_SIZE) {
        await processBatch(batch);
        batch = [];
      }
    },
  });

  await consumer.run().finally(() => {
    if (batch.length > 0) {
      processBatch(batch);
      batch = [];
    }
    setInterval(() => {
      console.log("batch timed out");
      if (batch.length > 0) {
        processBatch(batch);
        batch = [];
      }
    }, BATCH_TIMEOUT);
  });
};

const processBatch = async (batch: Array<CartItem>) => {
  try {
    dotenv.config();

    AWS.config.update({
      region: "us-east-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_SECRET,
    });

    const ipc = MessageService.getInstance("http://host.docker.internal:4000");

    const params: AWS.EventBridge.PutEventsRequest = {
      Entries: [
        {
          Source: "CartService",
          DetailType: "ScanItem",
          Detail: JSON.stringify(batch),
        },
      ],
    };

    await ipc.sendBatchEvents(params);
    console.log("Batch processed and sent to EventBridge");
  } catch (error) {
    console.error("Error processing batch:", error);
  }
};

const shutdown = async (): Promise<void> => {
  await consumer.disconnect();
  console.log("Consumer disconnected");
};

runConsumer().catch(console.error);
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
