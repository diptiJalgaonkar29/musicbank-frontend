import React, { Suspense } from "react";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";

// Lazy load both components
const WPPTabHeaders = React.lazy(() =>
  import("../../wpp/components/Tabs/TabHeaders/WPPTabHeaders")
);
const SonicTabHeaders = React.lazy(() =>
  import("../../sonicspace/components/Tabs/TabHeaders/SonicTabHeaders")
);

const superBrandName = getSuperBrandName();

const TabHeaderWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPTabHeaders {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicTabHeaders {...props} />
        </Suspense>
      );
  }
};

export default TabHeaderWrapper;
