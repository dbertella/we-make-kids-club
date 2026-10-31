import { useEffect, useState } from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { type Product } from "../data/products";
import { readCart, writeCart } from "../utils/cart";

interface ProductDetailPageProps {
  product: Product;
}

function renderProductDetails(body: string) {
  return body
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((block, index) => {
      const image = block.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
      if (image && (image[2].startsWith("/") || /^https:\/\//i.test(image[2]))) {
        return <img key={index} src={image[2]} alt={image[1]} />;
      }

      return (
        <p key={index}>
          {block.split("\n").map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      );
    });
}

const formatPrice = (priceInPence: number) =>
  (priceInPence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const syncCart = () =>
      setQuantity(readCart().filter((item) => item.id === product.id).length);
    syncCart();
    window.addEventListener("wmkc:cart-updated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("wmkc:cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [product.id]);

  return (
    <main className="product-detail">
      <a className="store-back-link" href="/store">
        &larr; Back to store
      </a>
      <article className="product-detail-article">
        <h1>{product.name}</h1>
        <img className="article-hero-image" src={product.image} alt={product.name} />
        <div className="prose">
          {typeof product.body === "string" && product.body.trim() ? (
            renderProductDetails(product.body)
          ) : product.body ? (
            <TinaMarkdown content={product.body} />
          ) : (
            <p>{product.description}</p>
          )}
        </div>
        <footer className="product-purchase">
          <button
            className="product-detail-add-button"
            type="button"
            onClick={() => writeCart([...readCart(), product])}
            aria-label={`Add ${product.name} to cart${quantity ? `, ${quantity} currently in cart` : ""}`}
          >
            <span>Add to cart</span>
            <span className="product-add-price">{formatPrice(product.price)}</span>
            {quantity > 0 && <span className="product-cart-count">{quantity}</span>}
          </button>
        </footer>
      </article>
    </main>
  );
}
