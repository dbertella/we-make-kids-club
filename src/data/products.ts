import productsConfig from "../content/config/products.json";

export const products = productsConfig.products;
export type Product = (typeof products)[number];
