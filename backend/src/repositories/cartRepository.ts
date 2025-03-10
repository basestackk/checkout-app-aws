import { Dynamo } from "../db";

async function addItemToCart(tableName: string, payload: any) {
  const { cartId, sku, name, description } = payload;

  const dynamo = Dynamo.instance("", tableName);

  const updateParams = {
    Key: {
      cartId: cartId,
      sku: sku,
    },
    UpdateExpression:
      "SET " +
      "quantity = if_not_exists(quantity, :start) + :increment, " +
      "#name = if_not_exists(#name, :name), " +
      "description = if_not_exists(description, :description)",
    ExpressionAttributeValues: {
      ":increment": 1,
      ":start": 0,
      ":name": name,
      ":description": description,
    },
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamo.update("cartId", cartId, updateParams);
    console.log("Item updated in cart:", cartId, sku);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw new Error(`Failed to add item to cart ${cartId}, sku ${sku}`);
  }
}

async function getItemsInCart(tableName: string, payload: any) {
  const { cartId } = payload;

  const dynamo = Dynamo.instance("", tableName);

  const queryParams = {
    KeyConditionExpression: "cartId = :cartId",
    ExpressionAttributeValues: {
      ":cartId": cartId,
    },
  };

  try {
    const result = await dynamo.fetch(queryParams);
    console.log("Items retrieved:", result);
    return result;
  } catch (error) {
    console.error("Error retrieving items from cart:", error);
    throw new Error(`Failed to retrieve items for cart ${cartId}`);
  }
}

async function removeItemFromCart(
  tableName: string,
  cartId: string,
  sku: string
) {
  const dynamo = Dynamo.instance("", tableName);

  const updateParams = {
    Key: {
      cartId: cartId,
      sku: sku,
    },
    UpdateExpression:
      "SET quantity = if_not_exists(quantity, :start) - :decrement",
    ExpressionAttributeValues: {
      ":decrement": 1,
      ":start": 0,
    },
    ConditionExpression: "quantity > :zero",
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamo.update("cartId", cartId, updateParams);
    console.log("Item removed from cart:", cartId, sku);
  } catch (error) {
    console.error("Error decrementing item count:", error);
    throw new Error(`Failed to decrement item count for cart ${cartId}, sku ${sku}`);
  }
}

export { addItemToCart, removeItemFromCart, getItemsInCart };
