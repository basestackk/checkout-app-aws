import { addPricingRuleHandler } from "./handlers/commands";

interface Payload {
  detail?: Record<string, unknown>;
  command?: Record<string, unknown>;
}


type CommandHandlerMap = {
  [key: string]: (command: Record<string, unknown>) => Promise<unknown>;
};

const commandHandlerMap: CommandHandlerMap = {
  "addPricingRule": addPricingRuleHandler,
};

async function handleCommand(command: Record<string, unknown>): Promise<unknown> {
  const handler = commandHandlerMap[command.type as string];
  if (handler) {
    return await handler(command);
  } else {
    throw new Error(`Handler not found for command: ${command.type}`);
  }
}

export const handler = async (event: Record<string, unknown>) => {
  try {
    const payload: Payload = event.payload || event;

    if (payload.command) {
      return await handleCommand(payload.command);
    } else {
      throw new Error("invalid payload received")
    }
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
};
