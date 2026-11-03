import type { TinaMarkdownContent } from "tinacms/dist/rich-text";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  body?: TinaMarkdownContent | TinaMarkdownContent[];
}

export interface ProductContent extends Omit<Product, "id"> {
  productId: string;
}

export function toProduct(product: ProductContent): Product {
  const { productId, ...details } = product;
  return { ...details, id: productId };
}
