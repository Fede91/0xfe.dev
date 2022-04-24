import React, { useEffect } from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { useColorMode } from "theme-ui";
import { getCurrentLangKey, getLangs, getUrlForLang } from "ptz-i18n";
import { IntlProvider } from "react-intl";
import NavigationFooter from "@components/Navigation/Navigation.Footer";
import NavigationHeader from "@components/Navigation/Navigation.Header";
import ArticlesContextProvider from "../../sections/articles/Articles.List.Context";

import { globalStyles } from "@styles";

interface ILayout {
  location: any;
}

/**
 * <Layout /> needs to wrap every page as it provides styles, navigation,
 * and the main structure of each page. Within Layout we have the <Container />
 * which hides a lot of the mess we need to create our Desktop and Mobile experiences.
 */
const Layout: React.FC<ILayout> = ({ children, location, ...otherProps }) => {
  const [colorMode] = useColorMode();

  console.log({ location, otherProps });
  useEffect(() => {
    parent.postMessage({ theme: colorMode }, "*");
  }, [colorMode]);

  return (
    <IntlProvider locale="en-us">
      <ArticlesContextProvider>
        <Container>
          <Global styles={globalStyles} />
          <NavigationHeader />
          {children}
          <NavigationFooter />
        </Container>
      </ArticlesContextProvider>
    </IntlProvider>
  );
};

export default Layout;

const Container = styled.div`
  position: relative;
  background: ${(p) => p.theme.colors.background};
  transition: ${(p) => p.theme.colorModeTransition};
  min-height: 100vh;
`;
