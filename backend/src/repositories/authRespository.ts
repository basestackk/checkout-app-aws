import {Dynamo} from '../db'


export const getUser = async (tableName: string, email: string) => {
  try {
    const dynamo = Dynamo.instance('', tableName)
    const result = await dynamo.fetchOneByKey("email", email)
    return result;
  } catch (error) {
    console.error("Error retrieving item:", error);
    throw new Error('Failed to retrieve item from DynamoDB');
  }
};

export const addUser = async (tableName: string, item: Record<string, any>) => {
  try {
    const dynamo = Dynamo.instance('', tableName)
    const result = await dynamo.insert(item)
    return result;
  } catch (error) {
    console.error("Error retrieving item:", error);
    throw new Error('Failed to retrieve item from DynamoDB');
  }
};

export const updateUser = async (tableName: string, item: Record<string, any>) => {
  try {
    const dynamo = Dynamo.instance('', tableName)
    await dynamo.update('email', item.email, item)
    return { success: true };
  } catch (error) {
    console.error("Error inserting item:", error);
    throw new Error('Failed to insert item into DynamoDB');
  }
};
