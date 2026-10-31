import productsConfig from "../content/config/products.json";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";

export const products = productsConfig.products;
export type Product = Omit<(typeof products)[number], "body"> & {
  body?: TinaMarkdownContent | TinaMarkdownContent[] | string;
};
