import {getItemsInCart} from "../../../repositories/cartRepository";
import type { GetCartItem } from "services/cart/models/payload/getCartItem";
import type { CartItem } from "../../../models/domain";

export async function GetScannedItemsHandler(
  query: GetCartItem,
): Promise<Array<CartItem>> {
  try {
    console.log("Successfully received scan item command");
    return await getItemsInCart("cart-db", query.cartId);
  } catch (error) {
    throw new Error("Error in Scan Item: " + (error as Error).message);
  }
}
