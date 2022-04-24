/* eslint-disable */

// https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-transformer-sharp/src/fragments.js

const GatsbyFluid_withWebp = `
  base64
  aspectRatio
  src
  srcSet
  srcWebp
  srcSetWebp
  sizes
`;

module.exports.local = {
  articles: `{
    articles: allArticle(
      sort: { fields: [date, title], order: DESC }
      limit: 1000
    ) {
      edges {
        node {
          id
          slug
          secret
          title
          author
          date(formatString: "MMMM Do, YYYY")
          dateForSEO: date
          timeToRead
          excerpt
          canonical_url
          subscription
          body
          hero {
            full: childImageSharp {
              fluid(maxWidth: 944, quality: 100) {
                ${GatsbyFluid_withWebp}
              }
            }
            regular: childImageSharp {
              fluid(maxWidth: 653, quality: 100) {
                ${GatsbyFluid_withWebp}
              }
            }
            narrow: childImageSharp {
              fluid(maxWidth: 457, quality: 100) {
                ${GatsbyFluid_withWebp}
              }
            }
            seo: childImageSharp {
              fixed(width: 1200, quality: 100) {
                src
              }
            }
          }
        }
      }
    }
  }`,
  authors: `{
    authors: allAuthor {
      edges {
        node {
          authorsPage
          bio
          id
          name
          featured
          social {
            url
          }
          slug
          avatar {
            small: childImageSharp {
              fluid(maxWidth: 50, quality: 100) {
                ${GatsbyFluid_withWebp}
              }
            }
            medium: childImageSharp {
              fluid(maxWidth: 100, quality: 100) {
                ${GatsbyFluid_withWebp}
              }
            }
            large: childImageSharp {
              fluid(maxWidth: 328, quality: 100) {
                ${GatsbyFluid_withWebp}
              }
            }
          }
        }
      }
    }
  }`,
};

// on references, contentful_id and __typename must be provided
/*
full: fluid(maxWidth: 944, quality: 100) {
              ${GatsbyFluid_withWebp}
            }
            regular: fluid(maxWidth: 653, quality: 100) {
              ${GatsbyFluid_withWebp}
            }
            narrow: fluid(maxWidth: 457, quality: 100) {
              ${GatsbyFluid_withWebp}
            }
            seo: fixed(width: 1200, quality: 100) {
              src
            }


 filename
            publicUrl
            url
            title
            https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/

          body {
            raw
            references {
              gatsbyImageData(layout: FULL_WIDTH, quality: 100)
              description
              title
              contentful_id
              __typename
            }
          }
*/
module.exports.contentful = {
  // , filter: {node_locale: {eq:$locale}
  articles: `{
    articles: allContentfulBlogPost(sort: {order: DESC, fields: publishedDate}) {
      edges {
        node {
          title
          excerpt {
            excerpt
          }
          slug
          contentful_id
          createdAt
          id
          node_locale
          publishedDate
          body {
            childMdx {
              body
              timeToRead
            }
          }
          poster {
            full: gatsbyImageData(layout: FULL_WIDTH, quality: 100)
            regular: gatsbyImageData(layout: FULL_WIDTH, quality: 100)
            narrow: gatsbyImageData(layout: CONSTRAINED, quality: 100)
          }
        }
      }
    }
  }`,
  articlesOLD: `{
    articles: allContentfulArticle(sort: {fields: [date, title], order: DESC}, limit: 1000) {
      edges {
        node {
          body {
            childMdx {
              body
              timeToRead
            }
          }
          excerpt
          title
          slug
          secret
          date(formatString: "MMMM Do, YYYY")
          dateForSEO: date
          hero {
            full: fluid(maxWidth: 944, quality: 100) {
              ${GatsbyFluid_withWebp}
            }
            regular: fluid(maxWidth: 653, quality: 100) {
              ${GatsbyFluid_withWebp}
            }
            narrow: fluid(maxWidth: 457, quality: 100) {
              ${GatsbyFluid_withWebp}
            }
            seo: fixed(width: 1200, quality: 100) {
              src
            }
          }
          id
          author {
            name
          }
        }
      }
    }
  }
  `,
  /*authors: `{
    authors: allContentfulAuthor {
      edges {
        node {
          avatar {
            small: fluid(maxWidth: 50, quality: 100) {
              ${GatsbyFluid_withWebp}
            }
            medium: fluid(maxWidth: 100, quality: 100) {
              ${GatsbyFluid_withWebp}
            }
            large: fluid(maxWidth: 328, quality: 100) {
              ${GatsbyFluid_withWebp}
            }
          }
          fields {
            authorsPage
            slug
          }
          bio
          id
          name
          social
          featured
        }
      }
    }
  }`,*/
};
