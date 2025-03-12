import {getItemsInCart} from "../../../../../repositories/cartRepository";

export async function GetScannedItemsHandler(
  query: any,
): Promise<Record<string, any>> {
  try {
    console.log("Successfully received scan item command");

    const items = await getItemsInCart("cart-db-read", query.payload)

    return {
      message: "Item scanned successfully",
      items
    };
  } catch (error) {
    throw new Error("Error in Scannint Item: " + (error as Error).message);
  }
}
