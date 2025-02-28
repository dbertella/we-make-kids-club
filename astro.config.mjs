// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tinaDirective from "./astro-tina-directive/register";

import cookieconsent from "@jop-software/astro-cookieconsent";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://wemakekidsclub.com/",
  trailingSlash: "never",
  integrations: [
    mdx(),
    sitemap(),
    react(),
    tinaDirective(),
    cookieconsent({
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom left",
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          position: "right",
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          readOnly: true,
        },
        analytics: {
          enabled: true,
        },
      },
      language: {
        default: "en",
        autoDetect: "browser",
        translations: {
          en: {
            consentModal: {
              title: "Hi there, it's cookie time!",
              description:
                "We use cookies to enhance your experience on our site and to analyze our traffic.",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              showPreferencesBtn: "Manage preferences",
              footer:
                '<a href="/privacy">Privacy Policy</a>\n<a href="/terms">Terms and conditions</a>',
            },
            preferencesModal: {
              title: "Consent Preferences Center",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              savePreferencesBtn: "Save preferences",
              closeIconLabel: "Close modal",
              serviceCounterLabel: "Service|Services",
              sections: [
                {
                  title: "Cookie Usage",
                  description:
                    'By clicking "Save Preferences", you consent to the use of cookies in accordance with your selected preferences. You can change your settings at any time by clicking the "Cookie Settings" link in the footer of our website.',
                },
                {
                  title:
                    'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
                  description:
                    "These cookies are necessary for the website to function and cannot be switched off.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analytics Cookies",
                  description:
                    "Help us improve our website by collecting and reporting information on its usage.",
                  linkedCategory: "analytics",
                },
                {
                  title: "More information",
                  description:
                    'For any query in relation to my policy on cookies and your choices, please <a class="cc__link" href="mailto:wemakekidsclub@gmail.com">contact me</a>.',
                },
              ],
            },
          },
        },
      },
    }),
  ],

  redirects: {
    ...(process.env.TINA_PUBLIC_IS_LOCAL === "true"
      ? { "/admin": "/admin/index.html" }
      : {}),
  },

  adapter: vercel(),
});
