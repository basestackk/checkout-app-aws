export class CartItem {
    cartId: string;
    sku: string;
    name: string;
    price: number;
    description: string;
  
    constructor(cartId: string, sku: string, name: string, price: number, description: string) {
      this.cartId = cartId;
      this.sku = sku;
      this.name = name;
      this.price = price;
      this.description = description;
    }
  }
  