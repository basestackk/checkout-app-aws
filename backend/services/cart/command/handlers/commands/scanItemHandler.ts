import { addItemToCart } from "../../../repositories/cartRepository";
import { MessageService } from "../../../../../ipc/messaging-service";
import { getInventoryItemBySku } from "../../../../../repositories";

export async function ScanItemHandler(command: any): Promise<Record<string, any>> {
  try {
    const item = await getInventoryItemBySku('inventory', command.payload.sku);

    if (!item) {
      throw new Error(`Item with SKU ${command.payload.sku} not found in inventory`);
    }

    if (item.quantity <= 0) {
      throw new Error(`Item with SKU ${command.payload.sku} is out of stock`);
    }

    command.payload.name = item.name;
    command.payload.description = item.description;

    await addItemToCart("carts", command.payload);

    const ipc = MessageService.getInstance("");

    return await ipc.sendEvent(command.payload, "CartService", "itemAdded", "CartEvent");

  } catch (error) {
    throw new Error("Error in Scan Item: " + (error as Error).message);
  }
}
