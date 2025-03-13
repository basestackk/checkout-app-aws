import type { Db, Collection, Document, InsertOneResult, UpdateResult, DeleteResult, Filter, WithId, OptionalUnlessRequiredId } from "mongodb";
import { MongoClient } from "mongodb";

export class DocumentDB {
  static _instance: DocumentDB
  private _client: MongoClient
  private _db: Db
  private _mongoUrl: string
  private _dbName: string

  private constructor(url: string, db: string) {
    this._mongoUrl = url;
    this._dbName = db;
    this._mongoUrl = "mongodb://localhost:27017";
  
    const options: Record<string, boolean> = {
      useUnifiedTopology: true,
    };

    if (process.env.NODE_ENV === "production") {
      options.ssl = true;
      options.sslValidate = true;
    }

    this._client = new MongoClient(this._mongoUrl, options);
    this._db = this._client.db(this._dbName);
  }

  static instance(url: string, db: string): DocumentDB {
    if (!DocumentDB._instance) {
      DocumentDB._instance = new DocumentDB(url, db);
    }
    return DocumentDB._instance;
  }

  async connect(): Promise<void> {
    try {
      await this._client.connect();
    } catch (error) {
      console.error("Connection to MongoDB failed:", error);
      throw new Error("Failed to connect to the database.");
    }
  }

  async disconnect(): Promise<void> {
    await this._client.close();
  }

  async fetchOneByKey<T extends Document>(collectionName: string, key: string, value: string): Promise<WithId<T> | null> {
    try {
      await this.connect();
      const collection: Collection<T> = this._db.collection(collectionName);
      const filter: Filter<T> = { [key]: value } as Filter<T>;
      const result = await collection.findOne(filter);
      return result;
    } catch (error) {
      console.error("Error fetching data from DocumentDB:", error);
      throw new Error("Error fetching data");
    }
  }

  async insert<T extends Document>(collectionName: string, data: OptionalUnlessRequiredId<T>): Promise<InsertOneResult<T>> {
    try {
      await this.connect();
      const collection: Collection<T> = this._db.collection(collectionName);
      return await collection.insertOne(data);
    } catch (error) {
      console.error("Error inserting data into DocumentDB:", error);
      throw new Error("Error inserting data");
    }
  }

  async update<T extends Document>(collectionName: string, filter: Filter<T>, updateData: Partial<T>): Promise<UpdateResult> {
    try {
      await this.connect();
      const collection: Collection<T> = this._db.collection(collectionName);
      return await collection.updateOne(filter, { $set: updateData });
    } catch (error) {
      console.error("Error updating data in DocumentDB:", error);
      throw new Error("Error updating data");
    }
  }

  async deleteOneByKey(collectionName: string, key: string, value: string): Promise<DeleteResult> {
    try {
      await this.connect();
      const collection: Collection<Document> = this._db.collection(collectionName);
      return await collection.deleteOne({ [key]: value });
    } catch (error) {
      console.error("Error deleting data from DocumentDB:", error);
      throw new Error("Error deleting data");
    }
  }

  async fetch<T extends Document>(collectionName: string, query: Filter<T>): Promise<Array<WithId<T>>> {
    try {
      await this.connect();
      const collection: Collection<T> = this._db.collection(collectionName);
      return await collection.find(query).toArray();
    } catch (error) {
      console.error("Error fetching data from DocumentDB:", error);
      throw new Error("Error fetching data");
    }
  }
}
