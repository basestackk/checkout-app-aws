import { createClient, RedisClientType } from 'redis';

class Redis {
  private static instance: Redis;
  private redisUrl: string;
  private client: RedisClientType;

  private constructor(redisUrl: string = 'redis://localhost:6379') {
    this.redisUrl = redisUrl;
    this.client = createClient({ url: this.redisUrl });
    this.connect()
  }

  public static getInstance(redisUrl: string = 'redis://localhost:6379'): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis(redisUrl);
    }
    return Redis.instance;
  }

  async connect() {
    try {
      await this.client.connect();
    } catch (err) {
      console.error('Error connecting to Redis:', err);
    }
  }

  async disconnect() {
    try {
      await this.client.quit();
      console.log('Disconnected from Redis');
    } catch (err) {
      console.error('Error disconnecting from Redis:', err);
    }
  }

  async set(key: string, value: string, expirationTimeInSeconds: number = 3600) {
    try {
      await this.client.set(key, value, {
        EX: expirationTimeInSeconds,
      });
      console.log(`Set key ${key} with value ${value}`);
    } catch (err) {
      console.error('Error setting key in Redis:', err);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      if (value) {
        console.log(`Got value for key ${key}:`, value);
      } else {
        console.log(`No value found for key ${key}`);
      }
      return value;
    } catch (err) {
      console.error('Error getting key from Redis:', err);
      return null;
    }
  }

  async delete(key: string) {
    try {
      await this.client.del(key);
      console.log(`Deleted key ${key}`);
    } catch (err) {
      console.error('Error deleting key from Redis:', err);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const exists = await this.client.exists(key);
      if (exists === 1) {
        console.log(`Key ${key} exists in Redis`);
        return true;
      } else {
        console.log(`Key ${key} does not exist in Redis`);
        return false;
      }
    } catch (err) {
      console.error('Error checking key existence in Redis:', err);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      const ttl = await this.client.ttl(key);
      console.log(`Remaining TTL for ${key}: ${ttl} seconds`);
      return ttl;
    } catch (err) {
      console.error('Error getting TTL for key in Redis:', err);
      return -1;
    }
  }
}

export default Redis;
