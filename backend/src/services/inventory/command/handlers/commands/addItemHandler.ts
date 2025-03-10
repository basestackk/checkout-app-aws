import {addInventoryItem} from "../../../../../repositories/";
import { MessageService } from "../../../../../ipc/messaging-service";

export async function addItemHandler(
  command: any,
): Promise<Record<string, any>> {
  try {

    const response = await addInventoryItem("inventory", command.payload)

    const ipc = MessageService.getInstance("")

    await ipc.sendEvent(command.payload, "InventoryService", "itemAdded", "InventoryEvent")

    return response
  } catch (error) {
    throw new Error("Error in Add Item: " + (error as Error).message);
  }
}
