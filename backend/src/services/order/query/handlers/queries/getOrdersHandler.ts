import {fetchOrders} from "../../../../../repositories/";

export async function GetOrdersHandler(
  query: any,
): Promise<Record<string, any>> {
  try {
    console.log("Successfully received scan item command");

    const items = await fetchOrders('order-db-read', 'orders', {});

    return {
      message: "Orders fetched successfully",
      items: items
    };
  } catch (error) {
    throw new Error("Error in get Orders: " + (error as Error).message);
  }
}
