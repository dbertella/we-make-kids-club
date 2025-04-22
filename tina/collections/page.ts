import type { Collection } from "tinacms";

export const PageCollection: Collection = {
  name: "page",
  label: "Pages",
  path: "src/content/page",
  match: {
    exclude: '{workshops,home}',
  },
  format: "mdx",
  ui: {
    router: ({ document }) => {
      return `/${document._sys.filename}`;
    },
  },
  fields: [
    {
      name: "seoTitle",
      type: "string",
      required: true,
    },
    {
      name: "seoDescription",
      type: "string",
      required: true,
    },
    {
      name: "title",
      type: "string",
      required: true,
    },
    {
      name: "body",
      type: "rich-text",
      isBody: true,
      required: true,
    },
  ],
};
