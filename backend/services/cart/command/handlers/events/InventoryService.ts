import {addItemToCart} from "../../../../../repositories/cartRepository";

export async function ItemAddedHandler(
  payload: any,
): Promise<Record<string, any>> {
  try {
    console.log("Successfully received item added event");

    await addItemToCart("inventory", payload)

    return {
      message: "Item scanned successfully",
    };
  } catch (error) {
    throw new Error("Error in Scannint Item: " + (error as Error).message);
  }
}
