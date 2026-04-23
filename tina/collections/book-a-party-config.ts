import type { Collection } from "tinacms";

export const BookPartyConfigCollection: Collection = {
  name: "book_a_party_config",
  label: "Book a Party Form",
  path: "src/content/config",
  format: "json",
  match: {
    include: "book-a-party",
  },
  ui: {
    global: true,
  },
  fields: [
    {
      name: "ctaText",
      label: "Submit button text",
      type: "string",
      required: true,
    },
    {
      name: "partyPackages",
      label: "Party packages",
      type: "string",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item || "New package",
          };
        },
      },
    },
    {
      name: "ageGroups",
      label: "Age groups",
      type: "string",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item || "New age group",
          };
        },
      },
    },
    {
      name: "ownerEmailSubject",
      label: "Email subject sent to you",
      type: "string",
      required: true,
      ui: {
        description: "Use {name} as a placeholder for the sender's name",
      },
    },
    {
      name: "customerEmailSubject",
      label: "Email subject sent to customer",
      type: "string",
      required: true,
    },
    {
      name: "customerEmailBody",
      label: "Email body sent to customer",
      type: "string",
      required: true,
      ui: {
        component: "textarea",
        description:
          "Use {name} for the sender's name, {mailTo} for your email address",
      },
    },
    {
      name: "fields",
      label: "Form fields",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.label || "New field",
          };
        },
      },
      fields: [
        {
          name: "name",
          label: "Field name (form data key)",
          type: "string",
          required: true,
        },
        {
          name: "type",
          label: "Field type",
          type: "string",
          required: true,
          options: [
            { value: "text", label: "Text" },
            { value: "email", label: "Email" },
            { value: "tel", label: "Telephone" },
            { value: "radio", label: "Radio buttons" },
            { value: "textarea", label: "Textarea" },
          ],
        },
        {
          name: "label",
          label: "Label shown to user",
          type: "string",
          required: true,
        },
        {
          name: "required",
          label: "Required?",
          type: "boolean",
        },
        {
          name: "options",
          label: "Options key (for radio fields)",
          type: "string",
          ui: {
            description:
              'Only for radio fields. Must match a key at the top level (e.g. "partyPackages" or "ageGroups")',
          },
        },
      ],
    },
  ],
};
