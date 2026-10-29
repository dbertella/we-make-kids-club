import { useEffect, useState } from "react";
import { readCart, writeCart, type Product } from "../utils/cart";
import { products } from "../data/products";

const formatPrice = (priceInPence: number) =>
  (priceInPence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

export default function StorePage() {
  const [cart, setCart] = useState<Product[]>([]);

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

  return (
    <main className="store">
      <header className="store-heading">
        <h1>Eco-Friendly Crafts &amp; Workshops</h1>
        <p>Support sustainable kids' activities with every purchase.</p>
      </header>

      <section className="products-grid" aria-label="Products">
        {products.map((product) => {
          const quantity = cart.filter((item) => item.id === product.id).length;
          return (
            <article className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <div className="price-row">
                  <span className="price">{formatPrice(product.price)}</span>
                <button
                  className="product-add-button"
                  type="button"
                  onClick={() => {
                    const updatedCart = [...readCart(), product];
                    writeCart(updatedCart);
                    setCart(updatedCart);
                  }}
                  aria-label={`Add ${product.name} to cart${quantity ? `, ${quantity} currently in cart` : ""}`}
                >
                  Add to cart{quantity > 0 && <span className="product-cart-count">{quantity}</span>}
                </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <footer className="store-footer">
        <h2>Secure payment</h2>
        <p>Payments are processed securely by Stripe.</p>
      </footer>
    </main>
  );
}