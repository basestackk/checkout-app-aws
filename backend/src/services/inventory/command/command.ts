import { addItemHandler } from "./handlers/commands";

type CommandHandlerMap = {
  [key: string]: (command: any) => Promise<Record<string, any>>;
};

const commandHandlerMap: CommandHandlerMap = {
  addItem: addItemHandler,
};

async function handleCommand(command: any): Promise<Record<string, any>> {
  const handler = commandHandlerMap[command.type];
  if (handler) {
    return await handler(command);
  } else {
    throw new Error(`Handler not found for command: ${command.type}`);
  }
}

export const handler = async (event: any) => {
  try {
    const payload = event.payload || event;

    if (payload.command) {
      return await handleCommand(payload.command);
    } else {
      const response = {
        status: "success",
        message: "Item added successfully",
      };

      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    }
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
};
