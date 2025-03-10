import {addPricingRule} from "../../../../../repositories/";

export async function AddedPricingRuleHandler(
  payload: any,
): Promise<Record<string, any>> {
  try {

    await addPricingRule("pricing-db-read", payload)

    return {
      message: "Pricing rule updated successfully",
    };
  } catch (error) {
    throw new Error("Error in updating pricing rule: " + (error as Error).message);
  }
}
