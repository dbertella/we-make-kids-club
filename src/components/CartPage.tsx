import { useEffect, useState } from "react";
import type { Product } from "../data/products";
import { readCart, writeCart } from "../utils/cart";

const formatPrice = (priceInPence: number) =>
  (priceInPence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

const CHECKOUT_SESSION_KEY = "wemakekidsclub-checkout-session";

interface CartPageProps {
  products: Product[];
}

const isCheckoutCartItem = (
  item: unknown,
): item is { productId: string; quantity: number } =>
  typeof item === "object" &&
  item !== null &&
  "productId" in item &&
  typeof item.productId === "string" &&
  "quantity" in item &&
  typeof item.quantity === "number" &&
  Number.isInteger(item.quantity) &&
  item.quantity >= 1 &&
  item.quantity <= 10;

export default function CartPage({ products }: CartPageProps) {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const syncCart = () => setCart(readCart(products));
    syncCart();
    window.addEventListener("wmkc:cart-updated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("wmkc:cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [products]);

  useEffect(() => {
    let syncInProgress = false;
    const syncCheckoutCart = async () => {
      const sessionId = localStorage.getItem(CHECKOUT_SESSION_KEY);
      if (!sessionId || syncInProgress) return;
      syncInProgress = true;

      try {
        const response = await fetch(
          `/api/sync-checkout-cart?session_id=${encodeURIComponent(sessionId)}`,
          { cache: "no-store" },
        );
        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "string"
              ? data.error
              : "Could not sync your cart from checkout.";
          throw new Error(message);
        }
        if (
          typeof data !== "object" ||
          data === null ||
          !("items" in data) ||
          !Array.isArray(data.items) ||
          !data.items.every(isCheckoutCartItem)
        ) {
          throw new Error("Checkout returned invalid cart details.");
        }

        const syncedCart = data.items.flatMap(({ productId, quantity }) => {
          const product = products.find((candidate) => candidate.id === productId);
          if (!product) throw new Error("A product from checkout is no longer available.");
          return Array.from({ length: quantity }, () => product);
        });

        setCart(syncedCart);
        writeCart(syncedCart);
        localStorage.removeItem(CHECKOUT_SESSION_KEY);
      } catch (syncError: unknown) {
        setError(
          syncError instanceof Error
            ? syncError.message
            : "Could not sync your cart from checkout.",
        );
      } finally {
        syncInProgress = false;
      }
    };

    void syncCheckoutCart();
    window.addEventListener("pageshow", syncCheckoutCart);
    return () => window.removeEventListener("pageshow", syncCheckoutCart);
  }, [products]);

  const updateCart = (updatedCart: Product[]) => {
    setCart(updatedCart);
    writeCart(updatedCart);
  };

  const cartItems = cart.reduce<{ product: Product; quantity: number }[]>((items, product) => {
    const existingItem = items.find((item) => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({ product, quantity: 1 });
    }
    return items;
  }, []);

  const changeQuantity = (product: Product, change: number) => {
    if (change > 0) {
      updateCart([...cart, product]);
      return;
    }

    const index = cart.findIndex((item) => item.id === product.id);
    if (index >= 0) {
      updateCart(cart.filter((_, itemIndex) => itemIndex !== index));
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0 || isCheckingOut) return;

    setIsCheckingOut(true);
    setError("");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems: cartItems.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { url?: string; sessionId?: string; error?: string }
        | null;

      if (!response.ok || !data?.url || !data.sessionId) {
        throw new Error(data?.error ?? `Checkout could not be started (HTTP ${response.status}).`);
      }

      localStorage.setItem(CHECKOUT_SESSION_KEY, data.sessionId);
      window.location.assign(data.url);
    } catch (checkoutError: unknown) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.");
      setIsCheckingOut(false);
    }
  };

  const total = cart.reduce((sum, product) => sum + product.price, 0);

  return (
    <main className="cart-page">
      <a className="store-back-link" href="/store">
        &larr; Back to store
      </a>
      <header className="cart-heading">
        <h1>Your cart</h1>
        <p>{cart.length} {cart.length === 1 ? "item" : "items"}</p>
      </header>

      {cart.length === 0 ? (
        <section className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Find a craft kit or workshop to get started.</p>
          <a className="cart-primary-link" href="/store">Browse products</a>
        </section>
      ) : (
        <section className="cart-content" aria-label="Cart items">
          <ul className="cart-items">
            {cartItems.map(({ product, quantity }) => (
              <li className="cart-item" key={product.id}>
                <img src={product.image} alt="" />
                <div className="cart-item-info">
                  <h2>{product.name}</h2>
                  <p>{formatPrice(product.price)}</p>
                  <div className="cart-quantity" role="group" aria-label={`${product.name} quantity`}>
                    <button
                      type="button"
                      aria-label={`Decrease ${product.name} quantity`}
                      disabled={quantity === 1}
                      onClick={() => changeQuantity(product, -1)}
                    >
                      &minus;
                    </button>
                    <span aria-live="polite">{quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${product.name} quantity`}
                      onClick={() => changeQuantity(product, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="cart-remove"
                  type="button"
                  aria-label={`Remove ${product.name} from cart`}
                  onClick={() => updateCart(cart.filter((item) => item.id !== product.id))}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <button className="cart-clear" type="button" onClick={() => updateCart([])}>
              Clear cart
            </button>
            <p><span>Subtotal</span><strong>{formatPrice(total)}</strong></p>
            <button className="cart-checkout" type="button" onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? "Redirecting..." : `Checkout · ${formatPrice(total)}`}
            </button>
            {error && <p className="cart-error" role="alert">{error}</p>}
          </div>
        </section>
      )}
    </main>
  );
}
