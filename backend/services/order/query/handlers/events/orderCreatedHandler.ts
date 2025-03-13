import {createOrder} from "../../../../../repositories/orderRepository";

export async function OrderCreatedHandler(
  payload: Record<string, unknown>,
): Promise<unknown> {
  try {
    await createOrder('order-db-read', 'orders', payload);

    return {
      message: "Item scanned successfully",
    };
  } catch (error) {
    throw new Error("Error in Scannint Item: " + (error as Error).message);
  }
}
