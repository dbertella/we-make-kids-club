import type { Collection } from "tinacms";

export const PageCollection: Collection = {
  name: "page",
  label: "Pages",
  path: "src/content/page",
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
      templates: [
        {
          name: "ButtonComponent",
          label: "Button",
          fields: [
            {
              name: "url",
              label: "Url",
              type: "string",
            },
            {
              name: "label",
              label: "Button Text",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      label: "Call to action",
      name: "cta",
      type: "object",
      fields: [
        {
          label: "Title",
          name: "title",
          type: "string",
          required: true,
        },
        {
          label: "Url",
          name: "url",
          type: "string",
          required: true,
        },
        {
          label: "Disclaimer",
          name: "disclaimer",
          type: "string",
        },
      ],
    },
    {
      label: "Testimonial",
      name: "testimonial",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item.title,
          };
        },
      },
      fields: [
        {
          label: "Title",
          name: "title",
          type: "string",
        },
        {
          type: "image",
          label: "Image",
          name: "imgSrc",
        },
      ],
    },
  ],
};
