import { Dynamo } from "../db/dynamo";

async function addPricingRule(tableName: string, payload: any) {
  const dynamo = Dynamo.instance("", tableName);
  try {
    await dynamo.upsert(tableName, payload);
    return payload.ruleText;
  } catch (error) {
    console.log(error)
    throw new Error(`Failed to add or update pricing rule for sku ${payload.sku}`);
  }
}

async function getPricingRules(tableName: string) : Promise<unknown> {
  const dynamo = Dynamo.instance("", tableName);
  try {
    const table =  await dynamo.fetch({});
    return table.Items
  } catch (error) {
    console.log(error)
    throw new Error(`Failed to fetch pricing rules`);
  }
}

export { addPricingRule, getPricingRules };
