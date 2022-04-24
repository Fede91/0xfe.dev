import type { GatsbyConfig } from "gatsby";
import languages from "./src/data/languages";

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const config: GatsbyConfig = {
  siteMetadata: {
    title: `0xfe.dev`,
    name: `0xfe.dev`,
    siteUrl: `https://www.yourdomain.tld`,
    description: `Lorem ipsum`,
    hero: {
      heading: `Hero - Lorem ipsum`,
      maxWidth: 652,
    },
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/0xFedev`,
      },
      {
        name: `devto`,
        url: `https://dev.to/0xfedev`,
      },
      {
        name: `medium`,
        url: `https://0xfedev.medium.com`,
      },
    ],
    languages,
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-theme-ui",
    {
      resolve: "gatsby-source-contentful",
      options: {
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        spaceId: process.env.CONTENTFUL_SPACE_ID,
      },
    },
    {
      resolve: `gatsby-plugin-emotion`,
      options: {
        sourceMap: true,
        autoLabel: "dev-only",
        labelFormat: `[local]`,
        cssPropOptimization: true,
      },
    },
    {
      resolve: "gatsby-plugin-i18n",
      options: {
        langKeyForNull: "any",
        langKeyDefault: languages.defaultLangKey,
        useLangKeyLayout: true,
        prefixDefault: false,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
      },
    },
  ],
};

export default config;
