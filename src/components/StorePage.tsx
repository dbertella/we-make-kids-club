import { useEffect, useState } from "react";
import { products, type Product } from "../data/products";
import { readCart, writeCart } from "../utils/cart";

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
              <a className="product-image-link" href={`/store/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </a>
              <div className="product-info">
                <h2>
                  <a className="product-details-link" href={`/store/${product.slug}`}>
                    {product.name}
                  </a>
                </h2>
                <p>{product.description}</p>
                <div className="price-row">
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
                    <span>Add to cart</span>
                    <span className="product-add-price">{formatPrice(product.price)}</span>
                    {quantity > 0 && <span className="product-cart-count">{quantity}</span>}
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