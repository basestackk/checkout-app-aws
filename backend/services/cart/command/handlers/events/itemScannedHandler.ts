import {addItemsToCart} from "../../../repositories/cartRepository";
import type { CartItem } from "../../../models/domain"

export async function ItemScannedHandler(
  payload: Array<CartItem>,
): Promise<void> {
  try {
    console.log("Successfully received scan item command");
    return await addItemsToCart("carts", payload);
  } catch (error) {
    throw new Error("Error in Scan Handler: " + (error as Error).message);
  }
}
