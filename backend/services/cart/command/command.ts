import { ScanItemHandler } from "./handlers/commands";

const commandHandlerMap: Record<string, (command: any) => Promise<Record<string, any>>> = {
  ScanItem: ScanItemHandler,
};

const handleCommand = async (command: any): Promise<void> => {
  const handler = commandHandlerMap[command.type];
  if (!handler) {
    throw new Error(`Handler not found for command: ${command.type}`);
  }
  await handler(command);
};

export const handler = async (event: any): Promise<void> => {
  try {
    const { payload = event } = event;

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
