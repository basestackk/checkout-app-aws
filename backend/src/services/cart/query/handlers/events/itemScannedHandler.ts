import {addItemToCart} from "../../../../../repositories/cartRepository";

export async function ItemScannedHandler(
  payload: any,
): Promise<Record<string, any>> {
  try {
    console.log("Successfully received scan item command");

    await addItemToCart("cart-db-read", payload)

    return {
      message: "Item scanned successfully",
    };
  } catch (error) {
    throw new Error("Error in Scannint Item: " + (error as Error).message);
  }
}
