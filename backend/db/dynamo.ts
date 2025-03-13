import * as AWS from "aws-sdk";
import type { AWSError } from "aws-sdk";
import type { PromiseResult } from "aws-sdk/lib/request";

export class Dynamo {
  static _instance: Dynamo;
  private _dynamoDB: AWS.DynamoDB.DocumentClient;
  private _tableName: string;

  private constructor(region: string, tableName: string) {
    
    this._tableName = tableName;

    this._dynamoDB = new AWS.DynamoDB.DocumentClient({
      endpoint: 'http://localhost:8000'
    });
  }

  static instance(region: string, tableName: string): Dynamo {
    if (!Dynamo._instance) {
      Dynamo._instance = new Dynamo(region, tableName);
    }
    return Dynamo._instance;
  }

  async fetchOneByKey(key: string, value: string): Promise<any> {
    const params = {
      TableName: this._tableName,
      Key: {
        [key]: value,
      },
    };

    try {
      const result = await this._dynamoDB.get(params).promise();
      return result.Item || null;
    } catch (error) {
      console.error("Error fetching data from DynamoDB:", error);
      throw new Error("Error fetching data");
    }
  }

  async fetch<T>(query: Partial<T>): Promise<PromiseResult<AWS.DynamoDB.ScanOutput, AWSError>> {
    const params = {
      TableName: this._tableName,
      ...query,
    };

    try {
      return await this._dynamoDB.scan(params).promise();
    } catch (error) {
      console.error("Error fetching data from DynamoDB:", error);
      throw new Error("Error fetching data");
    }
  }

  async insert<T>(data: Partial<T>): Promise<void> {
    const params = {
      TableName: this._tableName,
      Item: data,
    };

    try {
      await this._dynamoDB.put(params).promise();
      console.log("Data inserted into DynamoDB");
    } catch (error) {
      console.error("Error inserting data into DynamoDB:", error);
      throw new Error("Error inserting data");
    }
  }

  async upsert<T extends { sku: string }>(
    tableName: string,
    payload: T 
  ): Promise<void> {
    const updateExpressions: Array<string> = [];
    const expressionAttributeValues: Record<string, any> = {};

    const { sku, ...attributes } = payload;
  
    for (const [key, value] of Object.entries(attributes)) {
        updateExpressions.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = value;
      }
  
    const params = {
      TableName: tableName,
      Key: { sku },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };
  
    try {
      const result = await this._dynamoDB.update(params).promise();
      console.log("Item upserted successfully:", result.Attributes);
    } catch (error) {
      console.error("Error upserting item:", error);
    }
  }


  async update<T>(
    key: string,
    value: string,
    updateData: Partial<T>,
  ): Promise<void> {
    const params = {
      TableName: this._tableName,
      Key: {
        [key]: value,
      },
      UpdateExpression:
        "SET " +
        Object.keys(updateData)
          .map((k) => `${k} = :${k}`)
          .join(", "),
      ExpressionAttributeValues: Object.fromEntries(
        Object.entries(updateData).map(([k, v]) => [`:${k}`, v]),
      ),
      ConditionExpression: "attribute_exists(" + key + ")", // Ensure the item exists
      ReturnValues: "ALL_NEW",
    };

    try {
      await this._dynamoDB.update(params).promise();
      console.log("Data updated in DynamoDB");
    } catch (error) {
      console.error("Error updating data in DynamoDB:", error);
      throw new Error("Error updating data");
    }
  }

  async incrementBy1(
    key: string,
    value: string,
    fieldName: string,
  ): Promise<void> {
    const params = {
      TableName: this._tableName,
      Key: {
        [key]: value,
      },
      UpdateExpression:
        "SET " +
        fieldName +
        " = if_not_exists(" +
        fieldName +
        ", :start) + :val",
      ExpressionAttributeValues: {
        ":val": 1,
        ":start": 0, // If the field doesn't exist, it starts at 0
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      await this._dynamoDB.update(params).promise();
      console.log(`${fieldName} incremented by 1 in DynamoDB`);
    } catch (error) {
      console.error("Error incrementing by 1 in DynamoDB:", error);
      throw new Error("Error incrementing by 1");
    }
  }

  async incrementByY(
    key: string,
    value: string,
    fieldName: string,
    incrementValue: number,
  ): Promise<void> {
    const params = {
      TableName: this._tableName,
      Key: {
        [key]: value,
      },
      UpdateExpression:
        "SET " +
        fieldName +
        " = if_not_exists(" +
        fieldName +
        ", :start) + :val",
      ExpressionAttributeValues: {
        ":val": incrementValue,
        ":start": 0, // If the field doesn't exist, it starts at 0
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      await this._dynamoDB.update(params).promise();
      console.log(`${fieldName} incremented by ${incrementValue} in DynamoDB`);
    } catch (error) {
      console.error("Error incrementing by Y in DynamoDB:", error);
      throw new Error("Error incrementing by Y");
    }
  }

  async deleteOneByKey(key: string, value: string): Promise<any> {
    const params = {
      TableName: this._tableName,
      Key: {
        [key]: value,
      },
    };

    try {
      const result = await this._dynamoDB.delete(params).promise();
      return result;
    } catch (error) {
      console.error("Error deleting data from DynamoDB:", error);
      throw new Error("Error deleting data");
    }
  }

  async delete<T>(query: Partial<T>): Promise<void> {
    const params = {
      TableName: this._tableName,
      ...query,
    };

    try {
      await this._dynamoDB.scan(params).promise();
      console.log("Data deleted from DynamoDB");
    } catch (error) {
      console.error("Error deleting data from DynamoDB:", error);
      throw new Error("Error deleting data");
    }
  }
}
