import { Dynamo } from '../db';

async function getInventoryItemBySku(tableName: string, sku: string) {
  const dynamo = Dynamo.instance("", tableName);

  try {
    const result = await dynamo.fetchOneByKey("sku", sku);
    if (!result) {
      return null;
    }
    return result;
  } catch (error) {
    console.error('Error retrieving inventory item:', error);
    throw new Error(`Failed to retrieve item with SKU ${sku} from inventory`);
  }
}

async function addInventoryItem(tableName: string, payload: any) {
  const { sku, name, price, quantity, description } = payload;
  const dynamo = Dynamo.instance("", tableName);

  const item = {
    sku,
    name,
    price,
    quantity,
    description,
  };

  try {
    await dynamo.insert(item);
    console.log('Item added/updated:', item);
    return item;
  } catch (error) {
    console.error('Error adding/updating item:', error);
    throw new Error(`Failed to add or update item with sku ${sku}`);
  }
}

async function getInventoryItems(tableName: string) {
  const dynamo = Dynamo.instance("", tableName);

  try {
    const items = await dynamo.fetch({});
    return items;
  } catch (error) {
    console.error('Error retrieving inventory items:', error);
    throw new Error('Failed to retrieve inventory items');
  }
}

async function updateInventoryQuantity(tableName: string, payload: any) {
  const { sku, quantityChange } = payload;
  const dynamo = Dynamo.instance("", tableName);

  const updateParams = {
    quantity: quantityChange,
  };

  try {
    await dynamo.update("sku", sku, updateParams);
    console.log('Item quantity updated:', sku);
    return updateParams;
  } catch (error) {
    console.error('Error updating item quantity:', error);
    throw new Error(`Failed to update quantity for item with sku ${sku}`);
  }
}

async function removeInventoryItem(tableName: string, sku: string) {
  const dynamo = Dynamo.instance("", tableName);

  const params = {
    quantity: 0,
  };

  try {
    await dynamo.update("sku", sku, params);
    return { message: `Item with SKU ${sku} has been removed.` };
  } catch (error) {
    console.error('Error removing item from inventory:', error);
    throw new Error(`Failed to remove item with sku ${sku}`);
  }
}

export { 
  addInventoryItem, 
  getInventoryItems, 
  updateInventoryQuantity, 
  removeInventoryItem, 
  getInventoryItemBySku 
};
