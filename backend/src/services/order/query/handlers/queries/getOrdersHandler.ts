import {fetchOrders} from "../../../../../repositories/";

export async function GetOrdersHandler(
): Promise<Record<string, unknown>> {
  try {
    const items = await fetchOrders('order-db-read', 'orders', {});

    return {
      message: "Orders fetched successfully",
      items
    };
  } catch (error) {
    throw new Error("Error in get Orders: " + (error as Error).message);
  }
}
