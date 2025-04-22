import type { Collection } from "tinacms";

export const WorkshopsCollection: Collection = {
  name: "workshops",
  label: "Workshops",
  path: "src/content/page",
  match: {
    include: 'workshops',
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
    {
      label: "Workshops",
      name: "workshops",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item.description,
          };
        },
      },
      fields: [
        {
          label: "Info",
          name: "description",
          type: "rich-text",
        },
        {
          type: "image",
          label: "Image",
          name: "imgSrc",
        },
        {
          name: "cta",
          label: "Cta Text",
          type: "string",
        },
        {
          name: "ctaUrl",
          label: "Cta url",
          type: "string",
        },
        {
          name: "workshopDate",
          label: "Date and Time",
          type: "rich-text",
        },
        {
          type: 'boolean',
          name: 'expired',
          label: 'Expired',
          description: 'If this is checked the post will appear in the past items',
        },
      ],
    },
  ],
};
