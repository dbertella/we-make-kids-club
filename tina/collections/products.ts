import type { Collection } from "tinacms";

export const ProductsCollection: Collection = {
  name: "products",
  label: "Store Products",
  path: "src/content/config",
  format: "json",
  match: {
    include: "products",
  },
  ui: {
    global: true,
  },
  fields: [
    {
      name: "products",
      label: "Products",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.name || "New product",
        }),
      },
      fields: [
        {
          name: "id",
          label: "Product ID",
          type: "string",
          required: true,
          ui: {
            description: "Keep this ID stable so existing cart items remain valid.",
          },
        },
        {
          name: "name",
          label: "Name",
          type: "string",
          required: true,
        },
        {
          name: "description",
          label: "Description",
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
      ],
    },
  ],
};
