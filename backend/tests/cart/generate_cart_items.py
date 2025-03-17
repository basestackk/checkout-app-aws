import json
import random

cart_items = []
for _ in range(10000):
    cart_item = {
        "cartId": str(random.randint(1000, 9999)),
        "sku": random.choice(["ipd", "mbp", "atv", "tvq", "airpods", "iph", "vga"]),
        "name": random.choice(["Ipad Pro", "MacBook Pro", "Apple TV", "Airpods", "Apple TV 4K", "iphone", "VGA Adapter"]),
        "quantity": random.randint(1, 5),
    }
    cart_items.append(cart_item)

with open("random_cart_items.json", "w") as file:
    json.dump(cart_items, file, indent=4)

print("JSON data saved to random_cart_items.json")
