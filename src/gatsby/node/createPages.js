/* eslint-disable no-console, import/no-extraneous-dependencies, prefer-const, no-shadow */

require("dotenv").config();

const locales = [
  {
    default: true,
    path: `en`,
    label: `EN`,
    locale: `en-US`,
  },
  {
    path: `it`,
    label: `IT`,
    locale: `it-IT`,
  },
];

const log = (message, section) =>
  console.log(`\n\u001B[36m${message} \u001B[4m${section}\u001B[0m\u001B[0m\n`);

const path = require("path");
const createPaginatedPages = require("gatsby-paginate");

const templatesDirectory = path.resolve(__dirname, "../../templates");
const templates = {
  articles: path.resolve(templatesDirectory, "articles.template.tsx"),
  article: path.resolve(templatesDirectory, "article.template.tsx"),
  author: path.resolve(templatesDirectory, "author.template.tsx"),
};

const query = require("../data/data.query");
const normalize = require("../data/data.normalize");

// ///////////////// Utility functions ///////////////////

function buildPaginatedPath(index, basePath) {
  const normalizedPageRoots = locales.map((lang) =>
    lang.default ? "/" : `/${lang.path}/`
  );
  if (normalizedPageRoots.includes(basePath)) {
    return index > 1 ? `${basePath}page/${index}` : basePath;
  }
  return index > 1 ? `${basePath}/page/${index}` : basePath;
}

function slugify(string, base) {
  const slug = string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return `${base}/${slug}`.replace(/\/\/+/g, "/");
}

function getUniqueListBy(array, key) {
  return [...new Map(array.map((item) => [item[key], item])).values()];
}

const byDate = (a, b) => new Date(b.dateForSEO) - new Date(a.dateForSEO);

// ///////////////////////////////////////////////////////

module.exports = async (
  { page, actions: { createPage }, graphql },
  themeOptions
) => {
  const {
    rootPath,
    basePath = "/",
    authorsPath = "/authors",
    authorsPage = false,
    pageLength = 4,
    sources = {},
    mailchimp = "",
  } = themeOptions;

  const { data } = await graphql(`
    query siteQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);

  const contentfulArticles = await graphql(query.contentful.articles);
  // console.log(contentfulArticles);

  const normalizedEdges = contentfulArticles.data.articles.edges.map(
    normalize.contentful.articles
  );

  // console.log(normalizedEdges);

  for (let locale of locales) {
    const localizedEdges = normalizedEdges.filter(
      (edge) => edge.node_locale === locale.locale
    );

    const prefix =
      locale.locale.toLowerCase() === "en-us" ? "/" : "/" + locale.path + "/";

    createPaginatedPages({
      edges: localizedEdges,
      //contentfulArticles.data.articles.edges,
      createPage: createPage,
      pageTemplate: templates.articles,
      pageLength, // This is optional and defaults to 10 if not used
      pathPrefix: prefix, // This is optional and defaults to an empty string if not used
      buildPath: buildPaginatedPath,
      context: {
        authors: [],
        basePath,
        prefix,
        skip: pageLength,
        limit: pageLength,
        locale: locale.locale.toLowerCase(),
      }, // This is optional and defaults to an empty object if not used
    });

    for (let index = 0; index < localizedEdges.length; index++) {
      const edge = localizedEdges[index];
      /**
       * We need a way to find the next artiles to suggest at the bottom of the articles page.
       * To accomplish this there is some special logic surrounding what to show next.
       */
      let next = localizedEdges.slice(index + 1, index + 3);
      // If it's the last item in the list, there will be no articles. So grab the first 2
      if (next.length === 0) next = localizedEdges.slice(0, 2);
      // If there's 1 item in the list, grab the first article
      if (next.length === 1 && localizedEdges.length !== 2)
        next = [...next, localizedEdges[0]];
      if (localizedEdges.length === 1) next = [];

      createPage({
        path: prefix + edge.slug,
        component: templates.article,
        context: {
          slug: edge.slug,
          id: edge.id,
          nodeLocale: edge.node_locale,
          article: edge,
          next,
          basePath,
          pathPrefix: prefix,
          locale: locale.locale.toLowerCase(),
        },
      });
    }
  }

  return;

  // const {
  //   rootPath,
  //   basePath = "/",
  //   authorsPath = "/authors",
  //   authorsPage = false,
  //   pageLength = 6,
  //   sources = {},
  //   mailchimp = "",
  // } = themeOptions;

  console.log(sources);
  console.log({ page });
  // Defaulting to look at the local MDX files as sources.
  const { local = false, contentful = true } = sources;

  let authors;
  let articles;

  const dataSources = {
    local: { authors: [], articles: [] },
    contentful: { authors: [], articles: [] },
    netlify: { authors: [], articles: [] },
  };

  if (rootPath) {
    log("Config rootPath", rootPath);
  } else {
    log("Config rootPath not set, using basePath instead =>", basePath);
  }

  log("Config basePath", basePath);
  if (authorsPage) log("Config authorsPath", authorsPath);

  /*if (local) {
    try {
      log("Querying Authors & Articles source:", "Local");
      const localAuthors = await graphql(query.local.authors);
      const localArticles = await graphql(query.local.articles);

      dataSources.local.authors = localAuthors.data.authors.edges.map(
        normalize.local.authors
      );

      dataSources.local.articles = localArticles.data.articles.edges.map(
        normalize.local.articles
      );
    } catch (error) {
      console.error(error);
    }
  }*/

  if (contentful) {
    try {
      log("Querying Authors & Articles source:", "Contentful");
      //const contentfulAuthors = await graphql(query.contentful.authors);
      const contentfulArticles = await graphql(query.contentful.articles);
      console.log(contentfulArticles);

      /*dataSources.contentful.authors = contentfulAuthors.data.authors.edges.map(
        normalize.contentful.authors
      );*/

      dataSources.contentful.articles =
        contentfulArticles.data.articles.edges.map(
          normalize.contentful.articles
        );
    } catch (error) {
      console.error(error);
    }
  }

  // Combining together all the articles from different sources
  articles = [
    ...dataSources.local.articles,
    ...dataSources.contentful.articles,
    ...dataSources.netlify.articles,
  ].sort(byDate);

  const articlesThatArentSecret = articles.filter((article) => !article.secret);

  // Combining together all the authors from different sources
  /*authors = getUniqueListBy(
    [
      ...dataSources.local.authors,
      ...dataSources.contentful.authors,
      ...dataSources.netlify.authors,
    ],
    "name"
  );*/

  if (articles.length === 0 /*|| authors.length === 0*/) {
    throw new Error(`
    You must have at least one Author and Post. As reference you can view the
    example repository. Look at the content folder in the example repo.
    https://github.com/narative/gatsby-theme-novela-example
  `);
  }

  /**
   * Once we've queried all our data sources and normalized them to the same structure
   * we can begin creating our pages. First, we'll want to create all main articles pages
   * that have pagination.
   * /articles
   * /articles/page/1
   * ...
   */
  log("Creating", "articles page");
  createPaginatedPages({
    edges: articlesThatArentSecret,
    pathPrefix: basePath,
    createPage,
    pageLength,
    pageTemplate: templates.articles,
    buildPath: buildPaginatedPath,
    context: {
      authors: [],
      basePath,
      skip: pageLength,
      limit: pageLength,
    },
  });

  /**
   * Once the list of articles have bene created, we need to make individual article posts.
   * To do this, we need to find the corresponding authors since we allow for co-authors.
   */
  log("Creating", "article posts");
  articles.forEach((article, index) => {
    // Match the Author to the one specified in the article
    /*let authorsThatWroteTheArticle;
    try {
      authorsThatWroteTheArticle = authors.filter((author) => {
        const allAuthors = article.author
          .split(",")
          .map((a) => a.trim().toLowerCase());

        return allAuthors.some((a) => a === author.name.toLowerCase());
      });
    } catch (error) {
      throw new Error(`
        We could not find the Author for: "${article.title}".
        Double check the author field is specified in your post and the name
        matches a specified author.
        Provided author: ${article.author}
        ${error}
      `);
    }*/

    createPage({
      path: article.slug,
      component: templates.article,
      context: {
        article,
        authors: [], // authorsThatWroteTheArticle,
        basePath,
        permalink: `${data.site.siteMetadata.siteUrl}${article.slug}/`,
        slug: article.slug,
        id: article.id,
        title: article.title,
        canonicalUrl: article.canonical_url,
        mailchimp,
        next,
        locale: page.context.intl.language,
      },
    });
  });

  /**
   * By default the author's page is not enabled. This can be enabled through the theme options.
   * If enabled, each author will get their own page and a list of the articles they have written.
   */
  if (authorsPage) {
    log("Creating", "authors page");

    authors.forEach((author) => {
      const articlesTheAuthorHasWritten = articlesThatArentSecret.filter(
        (article) =>
          article.author.toLowerCase().includes(author.name.toLowerCase())
      );
      const path = slugify(author.slug, authorsPath);

      createPaginatedPages({
        edges: articlesTheAuthorHasWritten,
        pathPrefix: author.slug,
        createPage,
        pageLength,
        pageTemplate: templates.author,
        buildPath: buildPaginatedPath,
        context: {
          author,
          originalPath: path,
          skip: pageLength,
          limit: pageLength,
        },
      });
    });
  }
};
