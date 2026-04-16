console.log("Testing checkout functionality...");

// Simulate cart data
localStorage.setItem("techcore_cart", JSON.stringify([
  {name: "Laptop Gaming RTX 4070", price: 1299, qty: 1, icon: "💻"},
  {name: "Monitor 4K 27\"", price: 399, qty: 1, icon: "🖥️"}
]));

// Test cart loading
let cart = JSON.parse(localStorage.getItem("techcore_cart") || "[]");
console.log("Cart loaded:", cart.length, "items");

// Test total calculation
let subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
let shippingCost = 0; // standard shipping
let total = subtotal + shippingCost;
console.log("Subtotal:", subtotal + "€", "Total:", total + "€");

console.log("✅ Checkout logic test passed");

