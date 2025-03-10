import {createOrder} from "../../../../../repositories/orderRepository";

export async function OrderCreatedHandler(
  payload: any,
): Promise<Record<string, any>> {
  try {
    await createOrder('order-db-read', 'orders', payload);

    return {
      message: "Item scanned successfully",
    };
  } catch (error) {
    throw new Error("Error in Scannint Item: " + (error as Error).message);
  }
}
