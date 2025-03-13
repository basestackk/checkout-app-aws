import { GetInventoryHandler } from "./handlers/queries";
import { ItemAddedHandler } from "./handlers/events";
import { MessageService } from "../../../ipc";

export let MessageServiceInstance: MessageService | null = null;

type QueryHandlerMap = {
  [key: string]: (query: any) => Promise<Record<string, any>>;
};

type EventHandlerMap = {
  [eventSource: string]: {
    [eventType: string]: (payload: any) => Promise<Record<string, any>>;
  };
};

const queryHandlerMap: QueryHandlerMap = {
  "getItems": GetInventoryHandler,
};

const eventHandlerMap: EventHandlerMap = {
  "InventoryService": {
    "itemAdded": ItemAddedHandler
  }
};

export const getMessageServiceInstance = (): MessageService => {
  if (!MessageServiceInstance) {
    MessageServiceInstance = new MessageService("InventoryService");
    console.log('MessageService initialized');
  }
  return MessageServiceInstance;
};

async function handleQuery(query: any): Promise<Record<string, any>> {
  const handler = queryHandlerMap[query.type];
  if (handler) {
    return await handler(query);
  } else {
    throw new Error(`Handler not found for query: ${query.type}`);
  }
}

async function handleEvent(source: string, payload: any, type: string): Promise<void> {
  const handler = eventHandlerMap[source][type];
  if (handler) {
    await handler(payload);
  } else {
    throw new Error(`Handler not found for event: ${type}`);
  }
}

export const handler = async (event: any) => {
  try {
    const payload = event.payload || event;
    if (payload.query) {
      const response = await handleQuery(payload.query);
      return {
        statusCode: 200,
        body: JSON.stringify({
          response
        }),
      };
    } else if (payload.detail) {
      return await handleEvent(payload.source, payload.detail, payload.detail.eventType);
    } else {
      throw new Error(`Invalid payload, neither an event nor a query: ${payload}`);
    }
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
};
