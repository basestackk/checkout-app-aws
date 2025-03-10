import { GetPricingRuleHandler } from "./handlers/queries";
import { AddedPricingRuleHandler } from "./handlers/events";

type QueryHandlerMap = {
  [key: string]: (query: any) => Promise<Record<string, any>>;
};

type EventHandlerMap = {
  [key: string]: (payload: any) => Promise<Record<string, any>>;
};

const queryHandlerMap: QueryHandlerMap = {
  "getPricingRules": GetPricingRuleHandler,
};

const eventHandlerMap: EventHandlerMap = {
  "addedPricingRule": AddedPricingRuleHandler,
};

async function handleQuery(query: any): Promise<Record<string, any>> {
  const handler = queryHandlerMap[query.type];
  if (handler) {
    return await handler(query);
  } else {
    throw new Error(`Handler not found for query: ${query.type}`);
  }
}

async function handleEvent(payload: any, type: string): Promise<void> {
  const handler = eventHandlerMap[type];
  if (handler) {
    await handler(payload);
  } else {
    throw new Error(`Handler not found for event: ${type}`);
  }
}

export const handler = async (event: any) => {
  try {
    const payload = event.payload || event;
    if (payload.query) {
      return await handleQuery(payload.query);
    } else if (payload.detail) {
      return await handleEvent(payload.detail, payload.detail.eventType);
    } else {
      throw new Error(`Invalid payload, neither an event nor a query: ${payload}`);
    }
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
};
