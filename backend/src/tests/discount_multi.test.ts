import {Checkout} from "../services";
import {PricingRule} from "../services/checkoutService/models";

describe("Discount Types", () => {
  let checkout: Checkout;
  const price = 1399.99;
  const itemCount = 1000;
  const rule: PricingRule[] = [{
    sku: "mbp", discountAmount: 2, minQuantity: 5, discountType: "multiForX", minAmount: 0, ruleText: "",
    toJSON: function(): { sku: string; discountType: string; minQuantity: number; minAmount: number; discountAmount: number; ruleText: string; } {
      throw new Error("Function not implemented.");
    },
  }];
  beforeEach(async () => {
    checkout = new Checkout(rule);
  });
  test("should apply multiForX discount correctly for ipad, get 5 for the price of 2", () => {
    const discountedPrice = checkout.applyDiscount(rule[0], itemCount, price);
    expect(discountedPrice).toBe(559996);
  });
});
