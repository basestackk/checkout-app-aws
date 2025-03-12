import {createOrder} from "../../../../../repositories/orderRepository";
import { MessageService } from "../../../../../ipc/messaging-service";

export async function CreateOrderHandler(
  command: Record<string, unknown>
): Promise<Record<string, unknown>> {
  try {
    console.log("Successfully received create order command");

    await createOrder('orders', 'order-db', command.payload);

    const ipc = MessageService.getInstance("")

    await ipc.sendEvent(command.payload as Record<string, unknown>, "OrderService", "orderCreated", "OrderEvent")

    return {
      message: "Order created successfully",
    };
  } catch (error) {
    throw new Error("Error in create Order: " + (error as Error).message);
  }
}
