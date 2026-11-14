import type { Collection } from "tinacms";

export const ProductsCollection: Collection = {
  name: "products",
  label: "Store Products",
  path: "src/content/products",
  format: "mdx",
  ui: {
    router({ document }) {
      return `/store/${document._sys.filename}`;
    },
  },
  fields: [
    {
      name: "productId",
      label: "Product ID",
      type: "string",
      required: true,
      description: "Keep this ID stable so existing cart items remain valid.",
    },
    {
      name: "name",
      label: "Name",
      type: "string",
      required: true,
      isTitle: true,
    },
    {
      name: "shortDescription",
      label: "Short description",
      type: "string",
      required: true,
      ui: {
        component: "textarea",
      },
    },
    {
      name: "price",
      label: "Price (in pence)",
      type: "number",
      required: true,
    },
    {
      name: "image",
      label: "Product image",
      type: "image",
      required: true,
    },
    {
      name: "body",
      label: "Product details",
      type: "rich-text",
      isBody: true,
      description: "Write the product details and add more images where useful.",
    },
  ],
};
