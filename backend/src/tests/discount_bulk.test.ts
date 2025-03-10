import {Checkout} from "../services";
import {PricingRule} from "../services/checkoutService/models";

describe("Discount Types", () => {
  let checkout: Checkout;
  const price = 599.99;
  const itemCount = 1000;
  const rule: PricingRule[] = [{
    sku: "mbp", discountAmount: 399.99, minQuantity: 5, minAmount: 0, ruleText: "", discountType: "bulk",
    toJSON: function(): { sku: string; discountType: string; minQuantity: number; minAmount: number; discountAmount: number; ruleText: string; } {
      throw new Error("Function not implemented.");
    },
  }];
  beforeEach(async () => {
    checkout = new Checkout(rule);
  });
  test("should apply bulk discount correctly for ipad - like buy atleast 5, price for each would be $300", () => {
    const discountedPrice = checkout.applyDiscount(rule[0], itemCount, price);
    expect(discountedPrice).toBe(399990);
  });
});
