import { CreateOrderHandler } from "./handlers/commands"
import type {Payload} from "../../../types"

type CommandHandlerMap = {
  [key: string]: (command: Record<string, unknown>) => Promise<Record<string, unknown>>
};

const commandHandlerMap: CommandHandlerMap = {
  "createOrder": CreateOrderHandler,
};

async function handleCommand(command: Record<string, unknown>): Promise<void> {
  const handler = commandHandlerMap[command.type as string]
  if (handler) {
    await handler(command);
  } else {
    throw new Error(`Handler not found for command: ${command.type}`)
  }
}

export const handler = async (event: Record<string, unknown>) => {
  try {
    const payload: Payload = event.payload || event;

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
