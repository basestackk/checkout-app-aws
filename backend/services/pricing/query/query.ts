import { GetPricingRuleHandler } from "./handlers/queries";
import { AddedPricingRuleHandler } from "./handlers/events";

interface Payload {
  query?: Record<string, unknown>;
  detail?: Record<string, unknown>;
}

type QueryHandlerMap = {
  [key: string]: (query:Record<string, unknown> | null) => Promise<unknown>;
};

type EventHandlerMap = {
  [key: string]: (payload: Record<string, unknown>) => Promise<unknown>
};

const queryHandlerMap: QueryHandlerMap = {
  "getPricingRules": GetPricingRuleHandler,
};

const eventHandlerMap: EventHandlerMap = {
  "addedPricingRule": AddedPricingRuleHandler,
};

async function handleQuery(query: Record<string, unknown>): Promise<unknown> {
  const handler = queryHandlerMap[query.type as string];
  if (handler) {
    return await handler(query);
  } else {
    throw new Error(`Handler not found for query: ${query.type}`);
  }
}

async function handleEvent(payload: Record<string, unknown>, type: string): Promise<void> {
  const handler = eventHandlerMap[type];
  if (handler) {
    await handler(payload);
  } else {
    throw new Error(`Handler not found for event: ${type}`);
  }
}

export const handler = async (event: Record<string, unknown>) => {
  try {
    const payload : Payload = event.payload || event;
    if (payload.query) {
      return await handleQuery(payload.query);
    } else if (payload.detail) {
      return await handleEvent(payload.detail, payload.detail.eventType as string);
    } else {
      throw new Error(`Invalid payload, neither an event nor a query: ${payload}`);
    }
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
};
