import type { TinaMarkdownContent } from "tinacms/dist/rich-text";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  body?: TinaMarkdownContent | TinaMarkdownContent[];
}

export interface ProductContent extends Omit<Product, "id" | "slug"> {
  productId: string;
}

export function toProduct(product: ProductContent & Pick<Product, "slug">): Product {
  const { productId, ...details } = product;
  return { ...details, id: productId };
}
