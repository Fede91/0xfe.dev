import React from "react";
import styled from "@emotion/styled";
import { IntlProvider } from "react-intl";
import Section from "../components/Section";
import SEO from "../components/SEO";
import Paginator from "../components/Navigation/Navigation.Paginator";

import ArticlesHero from "../sections/articles/Articles.Hero";
import ArticlesList from "../sections/articles/Articles.List";

import Layout from "../components/Layout";
import { Template } from "../types";

const ArticlesPage: Template = ({ location, pageContext, ...otherProps }) => {
  console.log("ArticlesPage", { otherProps, pageContext, location });

  const articles = pageContext.group;
  const authors = pageContext.additionalContext.authors;
  const pathPrefix = pageContext.pathPrefix;

  return (
    <IntlProvider
      locale={pageContext.locale}
      defaultLocale={pageContext.locale}
      messages={{ testKey: "testValue" }}
    >
      <Layout location={location}>
        <SEO pathname={location.pathname} />
        <ArticlesHero authors={authors} />
        <Section narrow>
          <ArticlesList articles={articles} pathPrefix={pathPrefix} />
          <ArticlesPaginator show={pageContext.pageCount > 1}>
            <Paginator {...pageContext} />
          </ArticlesPaginator>
        </Section>
        <ArticlesGradient />
      </Layout>
    </IntlProvider>
  );
};

export default ArticlesPage;

const ArticlesGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 590px;
  z-index: 0;
  pointer-events: none;
  background: ${(p) => p.theme.colors.gradient};
  transition: ${(p) => p.theme.colorModeTransition};
`;

const ArticlesPaginator = styled.div<{ show: boolean }>`
  ${(p) => p.show && `margin-top: 95px;`}
`;
