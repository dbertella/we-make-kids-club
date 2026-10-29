import { useEffect, useState } from "react";
import { readCart, writeCart, type Product } from "../utils/cart";

const formatPrice = (priceInPence: number) =>
  (priceInPence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const syncCart = () => setCart(readCart());
    syncCart();
    window.addEventListener("wmkc:cart-updated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("wmkc:cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const updateCart = (updatedCart: Product[]) => {
    setCart(updatedCart);
    writeCart(updatedCart);
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
          lineItems: cart.map((product) => ({ productId: product.id })),
        }),
      });
      const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error ?? `Checkout could not be started (HTTP ${response.status}).`);
      }

      window.location.assign(data.url);
    } catch (checkoutError: unknown) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.");
      setIsCheckingOut(false);
    }
  };

  const total = cart.reduce((sum, product) => sum + product.price, 0);

  return (
    <main className="cart-page">
      <header className="cart-heading">
        <p className="cart-eyebrow">We Make Kids Club Store</p>
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
            {cart.map((product, index) => (
              <li className="cart-item" key={`${product.id}-${index}`}>
                <img src={product.image} alt="" />
                <div className="cart-item-info">
                  <h2>{product.name}</h2>
                  <p>{formatPrice(product.price)}</p>
                </div>
                <button
                  className="cart-remove"
                  type="button"
                  aria-label={`Remove ${product.name} from cart`}
                  onClick={() => updateCart(cart.filter((_, itemIndex) => itemIndex !== index))}
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
