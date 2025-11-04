// src/branding/componentWrapper/LinkInputWrapper.js
import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPLInkInput = React.lazy(() =>
  import("../wpp/components/Input/WPPLinkInput")
);
const SonicLinkInput = React.lazy(() =>
  import("../sonicspace/components/Input/SonicLinkInput")
);

const superBrandName = getSuperBrandName();

const LinkInputWrapper = (props) => {
  switch (superBrandName) {
    // case brandConstants.WPP:
    //   return (
    //     <Suspense fallback={<></>}>
    //       <WPPLInkInput {...props} />
    //     </Suspense>
    //   );
    default:
      return (
        <Suspense fallback={<></>}>
          <SonicLinkInput {...props} />
        </Suspense>
      );
  }
};

export default LinkInputWrapper;
