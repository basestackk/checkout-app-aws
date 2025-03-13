"use client";

import { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// GraphQL Queries
const GET_INVENTORY_AND_RULES = gql`
  query GetInventoryAndRules {
    items {
      sku
      name
      quantity
      description
      price
    }
    rules {
      sku
      discountType
      minQuantity
      discountAmount
      ruleText
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddItem(
    $sku: String!
    $name: String!
    $quantity: Int!
    $description: String
    $price: Float!
  ) {
    addItem(
      sku: $sku
      name: $name
      quantity: $quantity
      description: $description
      price: $price
    ) {
      sku
      name
      quantity
      description
      price
    }
  }
`;

const ADD_PRICING_RULE = gql`
  mutation AddPricingRule($rule: String!) {
    addPricingRule(rule: $rule)
  }
`;

const TablePage = () => {
  const { data, loading, error, refetch } = useQuery(GET_INVENTORY_AND_RULES);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    price: 0,
    description: "",
    quantity: 0,
  });
  const [discountRule, setDiscountRule] = useState("");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalWithDiscount, setTotalWithDiscount] = useState(0);

  const [addItemMutation] = useMutation(ADD_PRODUCT);
  const [addPricingRuleMutation] = useMutation(ADD_PRICING_RULE);

  // Update total amount dynamically
  useEffect(() => {
    if (!data) return;
    let total = 0;
    let discountedTotal = 0;

    data.items.forEach((product: any) => {
      const quantity = quantities[product.sku] || 0;
      total += product.price * quantity;
      const rule = data.rules.find((rule: any) => rule.sku === product.sku);
      discountedTotal += rule
        ? applyDiscount(rule, quantity, product.price)
        : product.price * quantity;
    });

    setTotalAmount(total);
    setTotalWithDiscount(discountedTotal);
  }, [quantities, data]);

  const applyDiscount = (
    rule: any,
    itemCount: number,
    price: number,
  ): number => {
    switch (rule.discountType) {
      case "multiForX":
        return applyMultiForXDiscount(rule, itemCount, price);
      case "bulk":
        return applyBulkDiscount(rule, itemCount, price);
      default:
        return price * itemCount;
    }
  };

  const applyMultiForXDiscount = (
    rule: any,
    itemCount: number,
    price: number,
  ): number => {
    if (itemCount >= rule.minQuantity) {
      const sets = Math.floor(itemCount / rule.minQuantity);
      const remaining = itemCount % rule.minQuantity;
      return sets * (rule.discountAmount * price) + remaining * price;
    }
    return price * itemCount;
  };

  const applyBulkDiscount = (
    rule: any,
    itemCount: number,
    price: number,
  ): number => {
    if (itemCount >= rule.minQuantity) {
      return itemCount * rule.discountAmount;
    }
    return price * itemCount;
  };

  const handleQuantityChange = (
    sku: string,
    type: "increment" | "decrement",
  ) => {
    setQuantities((prev) => ({
      ...prev,
      [sku]: Math.max((prev[sku] || 0) + (type === "increment" ? 1 : -1), 0),
    }));
  };

  const handleAddProduct = async () => {
    try {
      await addItemMutation({
        variables: {
          sku: newProduct.sku,
          name: newProduct.name,
          quantity: 50,
          description: newProduct.description,
          price: newProduct.price,
        },
        refetchQueries: [{ query: GET_INVENTORY_AND_RULES }],
        awaitRefetchQueries: true,
      });

      setNewProduct({
        name: "",
        sku: "",
        price: 0,
        description: "",
        quantity: 0,
      });
      setShowAddProductModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleAddDiscount = async () => {
    try {
      await addPricingRuleMutation({
        variables: { rule: discountRule },
        refetchQueries: [{ query: GET_INVENTORY_AND_RULES }],
        awaitRefetchQueries: true,
      });

      setDiscountRule("");
      setShowAddDiscountModal(false);
    } catch (error) {
      console.error("Error adding discount:", error);
    }
  };

  if (loading) return <p>Loading products and pricing rules...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      {/* Top Section: Buttons */}
      <div className="flex justify-between mb-6">
        <div className="space-x-4">
          <Button
            onClick={() => setShowAddProductModal(true)}
            className="bg-black text-white"
          >
            Add Product
          </Button>
          <Button
            onClick={() => setShowAddDiscountModal(true)}
            className="bg-black text-white"
          >
            Add Discount
          </Button>
        </div>
      </div>

      {/* Main Content: Product Table & Pricing Rules */}
      <div className="flex flex-wrap gap-6">
        {/* Product Table */}
        <div className="flex-1 max-w-[400px]">
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-md shadow-sm">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">SKU</th>
                  <th className="px-6 py-3 text-left">Price ($)</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item: any, index: number) => (
                  <tr key={item.sku} className="border-b">
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">{item.name}</td>
                    <td className="px-6 py-3">{item.sku}</td>
                    <td className="px-6 py-3">${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cart Section */}
        <div className="flex-1 max-w-[400px]">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            {data.items.map((product: any) => (
              <div
                key={product.sku}
                className="flex justify-between items-center mb-4"
              >
                <span>{product.name}</span>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() =>
                      handleQuantityChange(product.sku, "decrement")
                    }
                    className="bg-white text-black"
                  >
                    -
                  </Button>
                  <span>{quantities[product.sku] || 0}</span>
                  <Button
                    onClick={() =>
                      handleQuantityChange(product.sku, "increment")
                    }
                    className="bg-white text-black"
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}

            {/* Cart Total Row */}
            {/* Cart Total Row */}
            <div className="flex justify-between items-right mt-6 text-xl font-bold">
              <div className="text-gray-500">Total:</div>
              {totalAmount !== totalWithDiscount && (
                <div className="text-gray-500 line-through">
                  ${totalAmount.toFixed(2)}
                </div>
              )}
              <div className="text-green-600 ml-4">
                ${totalWithDiscount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Rules */}
        <div className="flex-1 max-w-[400px]">
          <h2 className="text-2xl font-bold mb-4">Pricing Rules</h2>
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
            {data.rules.map((rule: any, index: number) => (
              <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                <p className="text-sm font-semibold">{rule.ruleText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        title="Add New Product"
        description={""}
      >
        <div className="space-y-2">
          <Label>Product Name</Label>
          <Input
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />

          <Label>SKU</Label>
          <Input
            value={newProduct.sku}
            onChange={(e) =>
              setNewProduct({ ...newProduct, sku: e.target.value })
            }
          />

          <Label>Description</Label>
          <Input
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />

          <Label>Price</Label>
          <Input
            type="number"
            value={newProduct.price === 0 ? "" : newProduct.price} // Allow empty string when price is 0
            onChange={(e) => {
              const value = e.target.value;

              // If the input is empty, set price to 0, otherwise parse it to float
              const parsedPrice = value === "" ? 0 : parseFloat(value);

              setNewProduct({
                ...newProduct,
                price: isNaN(parsedPrice) ? 0 : parsedPrice, // Ensure price is a valid number
              });
            }}
          />

          <Button onClick={handleAddProduct}>Add Product</Button>
        </div>
      </Modal>

      {/* Add Discount Modal */}
      <Modal
        isOpen={showAddDiscountModal}
        onClose={() => setShowAddDiscountModal(false)}
        title="Add Discount"
        description={""}
      >
        <div className="space-y-4">
          <Label>Discount Rule</Label>
          <Input
            value={discountRule}
            onChange={(e) => setDiscountRule(e.target.value)}
          />

          <Button onClick={handleAddDiscount}>Add Discount</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TablePage;
