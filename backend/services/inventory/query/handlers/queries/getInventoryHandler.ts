import {getInventoryItems} from "../../../../../repositories/";

export async function GetInventoryHandler(
): Promise<Record<string, any>> {
  try {
    console.log("Successfully received get items query");

    const items = await getInventoryItems("inventory-db-read")

    return { items };
  } catch (error) {
    throw new Error("Error in Scan Item: " + (error as Error).message);
  }
}
