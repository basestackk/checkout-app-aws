import {getPricingRules} from "../../../../../repositories/";

export async function GetPricingRuleHandler(
): Promise<unknown> {
  try {
    return await getPricingRules("pricing")
  } catch (error) {
    throw new Error("Error in fetching pricing rules: " + (error as Error).message);
  }
}
