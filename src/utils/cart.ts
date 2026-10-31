import { products, type Product } from "../data/products";

const CART_STORAGE_KEY = "wemakekidsclub-cart";

export function readCart(): Product[] {
  try {
    const storedIds: unknown = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(storedIds)) return [];

    return storedIds.flatMap((id) =>
      typeof id === "string" ? products.filter((product) => product.id === id) : [],
    );
  } catch {
    return [];
  }
}

export function writeCart(cart: Product[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.map((product) => product.id)));
  window.dispatchEvent(new Event("wmkc:cart-updated"));
}