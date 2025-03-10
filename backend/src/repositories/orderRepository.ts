import { DocumentDB } from '../db';

async function createOrder(dbName: string, tableName: string, orderData: any) {
  const documentDB = DocumentDB.instance('mongodb://localhost:27017', dbName);
  const collection = tableName;

  try {
    await documentDB.insert(collection, orderData);
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
}

async function getOrderById(dbName: string, tableName: string, orderId: string) {
  const documentDB = DocumentDB.instance('mongodb://localhost:27017', dbName);
  const collection = tableName;

  try {
    const result = await documentDB.fetchOneByKey(collection, 'orderId', orderId);
    if (!result) {
      console.log("Order not found:", orderId);
    } else {
      console.log("Order retrieved successfully:", result);
    }
    return result;
  } catch (error) {
    console.error("Error retrieving order:", error);
    throw new Error(`Failed to retrieve order with ID ${orderId}`);
  }
}

async function fetchOrders(dbName: string, tableName: string, query: object) {
  const documentDB = DocumentDB.instance('mongodb://localhost:27017', dbName);
  const collection = tableName;

  try {
    const orders = await documentDB.fetch(collection, query);
    console.log("Orders retrieved successfully:", orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

async function updateOrder(dbName: string, tableName: string, orderId: string, updateData: any) {
  const documentDB = DocumentDB.instance('mongodb://localhost:27017', dbName);
  const collection = tableName;

  try {
    await documentDB.update(collection, { orderId }, updateData);
    console.log("Order updated successfully:", updateData);
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error(`Failed to update order with ID ${orderId}`);
  }
}

async function deleteOrder(dbName: string, tableName: string, orderId: string) {
  const documentDB = DocumentDB.instance('mongodb://localhost:27017', dbName);
  const collection = tableName;

  try {
    await documentDB.deleteOneByKey(collection, 'orderId', orderId);
    console.log("Order deleted successfully:", orderId);
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error(`Failed to delete order with ID ${orderId}`);
  }
}

export { createOrder, getOrderById, fetchOrders, updateOrder, deleteOrder };
