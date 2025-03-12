import {addPricingRule} from "../../../../../repositories/";

export async function AddedPricingRuleHandler(
  payload: Record<string, unknown>,
): Promise<unknown> {
  try {
    return await addPricingRule("pricing-db-read", payload)
  } catch (error) {
    throw new Error("Error in updating pricing rule: " + (error as Error).message);
  }
}
