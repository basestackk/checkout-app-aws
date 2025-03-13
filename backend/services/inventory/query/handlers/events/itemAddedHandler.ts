import {addInventoryItem} from "../../../../../repositories/";

export async function ItemAddedHandler(
  payload: any,
): Promise<Record<string, any>> {
  try {
    console.log("Successfully received item added event");

    await addInventoryItem("inventory-db-read", payload)
    
    return {
      message: "Item added successfully",
    };
  } catch (error) {
    throw new Error("Error in add Item: " + (error as Error).message);
  }
}
