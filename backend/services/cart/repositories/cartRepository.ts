import { Dynamo } from "../../../db";
import { CartItem } from "../models/domain/item";

async function addItemToCart(tableName: string, payload: CartItem) {
  const { cartId, sku, name, description } = payload;

  const dynamo = Dynamo.instance("", tableName);

  const updateParams = {
    Key: {
      cartId,
      sku,
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

async function addItemsToCart(tableName: string, items: Array<CartItem>): Promise<void> {
  const putRequests: Array<AWS.DynamoDB.DocumentClient.WriteRequest> = [];
  const updateRequests: Array<AWS.DynamoDB.DocumentClient.UpdateItemInput> = [];
  const dynamo = Dynamo.instance("", tableName);

  const seen = new Set<string>();

  const uniqueItems = items.filter(item => {
    const key = `${item.cartId}-${item.sku}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  uniqueItems.forEach(item => {
    const { cartId, sku, name, description } = item;
    
    const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: tableName,
      Key: {
        cartId,
        sku,
      },
      UpdateExpression:
        "SET quantity = if_not_exists(quantity, :start) + :increment, #name = if_not_exists(#name, :name), description = if_not_exists(description, :description)",
      ExpressionAttributeValues: {
        ":increment": 1,
        ":start": 0,
        ":name": name,
        ":description": description,
      },
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ReturnValues: "ALL_NEW",
    };

    updateRequests.push(updateParams);
    
    const putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: tableName,
      Item: {
        cartId,
        sku,
        name,
        description,
        quantity: 1,
      },
    };

    if (!seen.has(`${cartId}-${sku}`)) {
      putRequests.push({ PutRequest: { Item: putParams.Item } });
      seen.add(`${cartId}-${sku}`);
    }
  });

  try {
    if (putRequests.length > 0) {
      await dynamo.batchWrites({ RequestItems: { [tableName]: putRequests } });
    }
  } catch (error) {
    console.error('Error performing batch write:', error);
    throw new Error('Error performing batch write');
  }
}

async function getItemsInCart(
  tableName: string,
  cartId: string,
): Promise<Array<CartItem>> {
  const dynamo = Dynamo.instance("", tableName);

  try {
    const result = await dynamo.fetchItemsByKey(tableName, "cartId", cartId);
    const cartItems = result.Items
      ? result.Items.map(
          (item) =>
            new CartItem(
              item.cartId as string,
              item.sku as string,
              item.name as string,
              item.price as number,
              item.description as string,
            ),
        )
      : [];

    return cartItems;
  } catch (error) {
    console.error("Error retrieving items from cart:", error);
    throw new Error(`Failed to retrieve items for cart ${cartId}`);
  }
}

async function removeItemFromCart(
  tableName: string,
  cartId: string,
  sku: string,
) {
  const dynamo = Dynamo.instance("", tableName);

  const updateParams = {
    Key: {
      cartId,
      sku,
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
    throw new Error(
      `Failed to decrement item count for cart ${cartId}, sku ${sku}`,
    );
  }
}

export { addItemToCart, addItemsToCart, removeItemFromCart, getItemsInCart };
