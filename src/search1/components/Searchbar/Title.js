import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import "../../../_styles/Theming/__TYPOGRAPHY.css";
import TypographyWrapper from "../../../branding/componentWrapper/TypographyWrapper";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { getUserMeta } from '../../../common/utils/getUserAuthMeta';

export const TitleHomepage = () => {
  const { messages } = useContext(BrandingContext);
  const { brandName } = getUserMeta();

  return (
    <>
      {/* <p>------------still to be updated properly------------<p/> */}

      <h3 className="main-title-tsp">
        {messages?.home?.page?.titleSubtext && (
          <>
            <span
              className="main-subtitle boldFamily"
              name="scroll-to-point-search-mobile"
            >
              <TypographyWrapper
                type="5xl-display"
                slot="span"
                textID="home.page.titleSubtext"
                className="title"
              />
            </span>
          </>
        )}
        {
          window?.globalConfig?.DISPLAY_BRAND_NAME && (
            <span
              className="main-subtitle-Highlight boldFamily"
              name="scroll-to-point-search-mobile"
            >
              {brandName || ""}
            </span>
          )
        }
        {messages?.home?.page?.titleSubtextHighlight && (
          <>
            {" "}
            <span
              className="main-subtitle-Highlight boldFamily"
              name="scroll-to-point-search-mobile"
            >
              <TypographyWrapper
                type="5xl-display"
                slot="span"
                textID="home.page.titleSubtextHighlight"
                className="brandTitle"
              />
            </span>{" "}
          </>
        )}
        {messages?.home?.page?.titleSubtextHighlight && (
          <>
            {" "}
            <span className="main-subtitle boldFamily main-subtitle-tail">
              <TypographyWrapper
                type="5xl-display"
                slot="span"
                textID="home.page.titleSubtextTail"
                className="title"
              />
            </span>
          </>
        )}
        <span
          className="main-subtitle-subtext"
          name="scroll-to-point-search-mobile"
        >
          <TypographyWrapper
            type="5xl-display"
            slot="span"
            textID="home.page.titleSubtextSmall"
            className="title"
          ></TypographyWrapper>
        </span>
      </h3>
    </>
  );
};

export const TitleNewSearch = () => {
  return (
    <h3 className="heading--3">
      <FormattedMessage id="results.newSearch.title" />
    </h3>
  );
};
