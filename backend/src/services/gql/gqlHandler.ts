import * as dotenv from 'dotenv';

import { ApolloServer, gql } from 'apollo-server-lambda';
import { MessageService } from '../../ipc';

dotenv.config();

const typeDefs = gql`
  type Product {
    sku: String!
    name: String!
    quantity: Int!
    description: String
    price: Float
  }

  type Cart {
    cartId: String!
    items: [Product!]!
  }

  type PricingRule {
    sku: String!
    discountType: String!
    minQuantity: String!
    discountAmount: String!
    ruleText: String!
  }

  type Query {
    cart(cartId: String!): Cart
    items: [Product!]  # Query to get all items in the inventory
    rules: [PricingRule!]!
  }

  type Mutation {
    scanItem(cartId: String!, sku: String!, name: String!): Cart
    addItem(sku: String!, name: String!, quantity: Int!, description: String, price: Float):Product! # Mutation to add an item to inventory
    addPricingRule(rule: String!): String!
  }
`;

const messageService = MessageService.getInstance('cart-service');

// Cart Service Handlers
async function updateCartWithItem(cartId: string, sku: string, name: string): Promise<any> {
  const commandPayload = {
    type: 'ScanItem',
    payload: {
      cartId,
      sku,
      name
    }
  };

  try {
    const result = await messageService.sendCommand('cart-service-dev-CartService', commandPayload);
    return result;
  } catch (error) {
    console.error('Error invoking CartService commandHandler', error);
    throw new Error('Failed to update cart');
  }
}

async function getCart(cartId: string): Promise<any> {
  const queryPayload = {
    type: 'getItems',
    payload: { cartId }
  };

  try {
    const result = await messageService.sendQuery('CartServiceQuery', queryPayload);
    return result;
  } catch (error) {
    console.error('Error invoking CartService queryHandler', error);
    throw new Error('Failed to get cart details');
  }
}

async function addItemToInventory(sku: string, name: string, quantity: number, description: string, price: number): Promise<boolean> {
  const commandPayload = {
    type: 'addItem',
    payload: {
      sku,
      name,
      quantity,
      description,
      price
    }
  };

  try {
   return await messageService.sendCommand('combined-service-dev-InventoryService', commandPayload);
  } catch (error) {
    console.error('Error invoking InventoryService commandHandler', error);
    throw new Error('Failed to add item to inventory');
  }
}

async function addPricingRule(rule: string): Promise<string> {
  const commandPayload = {
    type: 'addPricingRule',
    payload: {
      rule,
    }
  };

  try {
   return await messageService.sendCommand('combined-service-dev-PricingService', commandPayload);
  } catch (error) {
    console.error('Error invoking PricingService commandHandler', error);
    throw new Error('Failed to add pricing Rule');
  }
}

async function getPricingRules(): Promise<any> {
  const queryPayload = { type: "getPricingRules", payload: { } };
  return await messageService.sendQuery("combined-service-dev-PricingServiceQuery", queryPayload);
}

async function getInventoryItems(): Promise<any> {
  const queryPayload = {
    type: 'getItems',
    payload: {
      
    }
  };

  try {
    const result = await messageService.sendQuery('combined-service-dev-InventoryServiceQuery', queryPayload);

    const parsedBody = JSON.parse(result.body);
    const items = parsedBody.response?.items || [];

    if (!Array.isArray(items)) {
      throw new Error("Inventory service response does not contain a valid items array.");
    }

    return items; 

  } catch (error) {
    console.error('Error invoking InventoryService queryHandler', error);
    throw new Error('Failed to get inventory items');
  }
}

const resolvers = {
  Query: {
    cart: async (_: any, { cartId }: { cartId: string }) => {
      return await getCart(cartId);
    },
    items: async () => {
      return await getInventoryItems();  // Resolver for getting items from inventory
    },
    rules: async() => await getPricingRules()
  },
  Mutation: {
    scanItem: async (_: any, { cartId, sku, name }: { cartId: string, sku: string, name: string }) => {
      return await updateCartWithItem(cartId, sku, name);
    },
    addItem: async (_: any, { sku, name, quantity, description, price }: { sku: string, name: string, quantity: number, description: string, price: number }) => {
      return await addItemToInventory(sku, name, quantity, description, price);  // Resolver for adding item to inventory
    },
    addPricingRule: async (_: any, { rule }: { rule: string }) =>
      await addPricingRule(rule),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event }) => {
    return { event };
  },
});

export const handler = server.createHandler();
