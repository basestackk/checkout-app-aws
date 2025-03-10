import { Dynamo } from "../db/dynamo";

async function addPricingRule(tableName: string, payload: any) {
  const dynamo = Dynamo.instance("", tableName);
  try {
    await dynamo.upsertItem(tableName, payload);
    return payload.ruleText;
  } catch (error) {
    throw new Error(`Failed to add or update pricing rule for sku ${payload.sku}`);
  }
}

async function getPricingRules(tableName: string) {
  const dynamo = Dynamo.instance("", tableName);
  try {
    const items = await dynamo.fetch({});
    return items;
  } catch (error) {
    throw new Error(`Failed to fetch pricing rules`);
  }
}

export { addPricingRule, getPricingRules };
