import { GetScannedItemsHandler } from "./handlers/queries";

type QueryHandlerMap = {
  [key: string]: (query: any) => Promise<Record<string, any>>;
};

type EventHandlerMap = {
  [eventSource: string]: {
    [eventType: string]: (payload: any) => Promise<Record<string, any>>;
  };
};

const queryHandlerMap: QueryHandlerMap = {
  "getItems": GetScannedItemsHandler,
};

const eventHandlerMap: EventHandlerMap = {

};

async function handleQuery(query: any): Promise<Record<string, any>> {
  const handler = queryHandlerMap[query.type];
  if (handler) {
    return await handler(query.payload);
  } else {
    throw new Error(`Handler not found for query: ${query.type}`);
  }
}

async function handleEvent(source: string, payload: any, type: string): Promise<void> {
  const handler = eventHandlerMap[source][type];
  if (handler) {
    await handler(payload);
  } else {
    throw new Error(`Handler not found for event: ${type}`)
  }
}

export const handler = async (event: any) : Promise<any> => {
  try {
    const payload = event.payload || event
    if (payload.query) {
      return await handleQuery(payload.query);
    } else if (payload.detail) {
       await handleEvent(payload.source, payload.detail, payload.detailType);
    } else {
      throw new Error(`Invalid payload, neither an event nor a query: ${payload}`);
    }
  } catch (error) {
    throw new Error(`Failed to fetch cart items: ${error}`);
  }
};
