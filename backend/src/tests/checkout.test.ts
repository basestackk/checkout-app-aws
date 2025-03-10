import {Checkout} from "../services";
import {readPricingRules} from "../services/checkoutService/controllers";

describe("Checkout System", () => {
  let checkout: Checkout;

  beforeEach(async () => {
    const pricingRules = await readPricingRules();
    checkout = new Checkout(pricingRules);
  });

  test("should correctly calculate total for multiple items with no discounts", () => {
    checkout.scan("atv");
    checkout.scan("ipd");
    checkout.scan("vga");

    const total = checkout.total();

    expect(total).toBe(689.49);
  });

  test("should apply 3 for 2 discount for Apple TV", () => {
    checkout.scan("atv");
    checkout.scan("atv");
    checkout.scan("atv");
    checkout.scan("vga");

    const total = checkout.total();

    expect(total).toBe(249.00);
  });

  test("should apply bulk discount on iPad when quantity is greater than 5", () => {
    checkout.scan("ipd");
    checkout.scan("ipd");
    checkout.scan("ipd");
    checkout.scan("ipd");
    checkout.scan("ipd");
    checkout.scan("ipd");

    const total = checkout.total();

    expect(total).toBe(2999.94);
  });

  test("should calculate total with mixed discounts correctly", () => {
    checkout.scan("atv");
    checkout.scan("atv");
    checkout.scan("atv");
    checkout.scan("ipd");
    checkout.scan("ipd");
    checkout.scan("ipd");
    checkout.scan("ipd");
    checkout.scan("ipd");

    const total = checkout.total();

    expect(total).toBe(2718.95);
  });
});
