import { CreateOrderHandler } from "./handlers/commands";



type CommandHandlerMap = {
  [key: string]: (command: any) => Promise<Record<string, any>>;
};

const commandHandlerMap: CommandHandlerMap = {
  "createOrder": CreateOrderHandler,
};

async function handleCommand(command: any): Promise<void> {
  const handler = commandHandlerMap[command.type];
  if (handler) {
    await handler(command);
  } else {
    throw new Error(`Handler not found for command: ${command.type}`);
  }
}

export const handler = async (event: any) => {
  try {
    const payload = event.payload || event;

    if (payload.command) {
      await handleCommand(payload.command);
    } else if (payload.detail) {
      // Handle event case if necessary
    }
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
};
