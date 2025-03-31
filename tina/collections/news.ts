import type { Collection } from "tinacms";

export const EventCollection: Collection = {
  name: "news",
  label: "News",
  path: "src/content/news",
  format: "mdx",
  ui: {
    router({ document }) {
      return `/news/${document._sys.filename}`;
    },
  },
  fields: [
    {
      name: 'draft',
      label: 'Draft',
      type: 'boolean',
      required: true,
      description: 'If this is checked the post will not be published',
    },
    {
      name: "seoTitle",
      label: "SEO title",
      type: "string",
    },
    {
      name: "seoDescription",
      label: "SEO description",
      type: "string",
    },
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "string",
    },
    {
      name: "category",
      label: "Category",
      type: "string",
    },
    {
      name: "pubDate",
      label: "Publication Date",
      type: "datetime",
    },
    {
      name: "updatedDate",
      label: "Updated Date",
      type: "datetime",
    },
    {
      name: "heroImage",
      label: "Hero Image",
      type: "image",
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
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
  ],
};
