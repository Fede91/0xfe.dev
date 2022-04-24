import React from "react";
import Link from "gatsby-link";
import { FormattedMessage } from "react-intl";
import { useColorMode } from "theme-ui";

interface ISelectLanguage {
  langs: { default?: boolean; path: string; label: string; locale: string }[];
}

const SelectLanguage: React.FC<ISelectLanguage> = ({ langs }) => {
  const [colorMode] = useColorMode();
  const isDark = colorMode === `dark`;
  const color = isDark ? "#fff" : "#000";

  const links = langs.map((lang) => (
    <Link
      to={lang.default ? "/" : `/${lang.path}`}
      key={lang.locale}
      style={{
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        color,
      }}
    >
      {lang.label}
    </Link>
  ));

  return (
    <section>
      {/* <header
        style={{
          color: "white",
        }}
      >
        <FormattedMessage id="selectLanguage" />
      </header> */}
      {links}
    </section>
  );
};

export default SelectLanguage;
