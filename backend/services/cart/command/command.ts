import { ScanItemHandler } from "./handlers/commands";
import { ItemScannedHandler } from "./handlers/events";

const commandHandlerMap: Record<
  string,
  (command: any) => Promise<Record<string, any>>
> = {
  addItem: ScanItemHandler,
};

type EventHandlerMap = {
  [eventSource: string]: {
    [eventType: string]: (payload: any) => Promise<void>;
  };
};

const eventHandlerMap: EventHandlerMap = {
  CartService: {
    ScanItem: ItemScannedHandler,
  },
};

const handleCommand = async (command: any): Promise<void> => {
  const handler = commandHandlerMap[command.type];
  if (!handler) {
    throw new Error(`Handler not found for command: ${command.type}`);
  }
  await handler(command);
};

async function handleEvent(source: string, payload: any, type: string): Promise<void> {
  const handler = eventHandlerMap[source][type];
  if (handler) {
    await handler(payload);
  } else {
    throw new Error(`Handler not found for event: ${type}`)
  }
}

export const handler = async (event: any): Promise<any> => {
  try {
    const { payload = event } = event;
    if (payload.command) {
      return await handleCommand(payload.command);
    } else if (payload.detail) {
      await handleEvent(payload.source, payload.detail, payload['detail-type']);
    } else {
      throw new Error(
        `Invalid payload, neither an event nor a query: ${payload}`,
      );
    }
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
};
