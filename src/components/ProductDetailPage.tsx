import { useEffect, useMemo, useState } from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField, useTina } from "tinacms/dist/react";
import type { ProductsQuery, ProductsQueryVariables } from "../../tina/__generated__/types";
import { toProduct, type Product } from "../data/products";
import { readCart, writeCart } from "../utils/cart";

interface ProductDetailPageProps {
  products: Product[];
  productSlug: string;
  variables: ProductsQueryVariables;
  data: ProductsQuery;
  query: string;
}

const formatPrice = (priceInPence: number) =>
  (priceInPence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

export default function ProductDetailPage(props: ProductDetailPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const productContent = data.products;
  const { product, products } = useMemo(() => {
    const product = toProduct({
      ...productContent,
      shortDescription: productContent.description,
      slug: props.productSlug,
    });
    return {
      product,
      products: props.products.map((item) =>
        item.id === product.id ? product : item,
      ),
    };
  }, [productContent, props.productSlug, props.products]);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const syncCart = () =>
      setQuantity(readCart(products).filter((item) => item.id === product.id).length);
    syncCart();
    window.addEventListener("wmkc:cart-updated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("wmkc:cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [product.id, products]);

  return (
    <main className="product-detail">
      <a className="store-back-link" href="/store">
        &larr; Back to store
      </a>
      <article className="product-detail-article">
        <h1 data-tina-field={tinaField(productContent, "name")}>{product.name}</h1>
        <img
          className="article-hero-image"
          src={product.image}
          alt={product.name}
          data-tina-field={tinaField(productContent, "image")}
        />
        <div className="prose" data-tina-field={tinaField(productContent, "body")}>
          {product.body ? (
            <TinaMarkdown content={product.body} />
          ) : null}
        </div>
        <footer className="product-purchase">
          <button
            className="product-detail-add-button"
            type="button"
            onClick={() => writeCart([...readCart(products), product])}
            aria-label={`Add ${product.name} to cart${quantity ? `, ${quantity} currently in cart` : ""}`}
          >
            <span>Add to cart</span>
            <span
              className="product-add-price"
              data-tina-field={tinaField(productContent, "price")}
            >
              {formatPrice(product.price)}
            </span>
            {quantity > 0 && <span className="product-cart-count">{quantity}</span>}
          </button>
        </footer>
      </article>
    </main>
  );
}
