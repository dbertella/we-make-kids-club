import { useEffect, useState } from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField, useTina } from "tinacms/dist/react";
import type { PageQuery, PageQueryVariables } from "../../tina/__generated__/types";
import type { Product } from "../data/products";
import { readCart, writeCart } from "../utils/cart";

interface StorePageProps {
  products: Product[];
  variables: PageQueryVariables;
  data: PageQuery;
  query: string;
}

const formatPrice = (priceInPence: number) =>
  (priceInPence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

export default function StorePage(props: StorePageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const { products } = props;
  const page = data.page;
  const [cart, setCart] = useState<Product[]>([]);

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

  return (
    <main className="store">
      <header className="store-heading">
        <h1 data-tina-field={tinaField(page, "title")}>{page.title}</h1>
        {page.subtitle && (
          <p data-tina-field={tinaField(page, "subtitle")}>{page.subtitle}</p>
        )}
      </header>
      {page.body && (
        <section className="store-intro" data-tina-field={tinaField(page, "body")}>
          <TinaMarkdown content={page.body} />
        </section>
      )}

      <section
        className={`products-grid${products.length === 1 ? " products-grid--single" : ""}`}
        aria-label="Products"
      >
        {products.map((product) => {
          const quantity = cart.filter((item) => item.id === product.id).length;
          return (
            <article className="product-card" key={product.id}>
              <a className="product-image-link" href={`/shop/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </a>
              <div className="product-info">
                <h2>
                  <a className="product-details-link" href={`/shop/${product.slug}`}>
                    {product.name}
                  </a>
                </h2>
                <p>{product.shortDescription}</p>
                <div className="price-row">
                  <button
                    className="product-add-button"
                    type="button"
                    onClick={() => {
                      const updatedCart = [...readCart(products), product];
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