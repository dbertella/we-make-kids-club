import type { Collection } from "tinacms";

export const HomeCollection: Collection = {
  name: "home",
  label: "Home",
  path: "src/content/page",
  match: {
    include: 'home',
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
    {
      label: "Workshops",
      name: "workshops",
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
          label: "Description",
          name: "description",
          type: "string",
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
      ],
    },
  ],
};
