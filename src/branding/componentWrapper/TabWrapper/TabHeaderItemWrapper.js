import React, { Suspense } from "react";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";

// Lazy load both components
const WPPTabHeaderItem = React.lazy(() =>
  import("../../wpp/components/Tabs/TabHeaderItem/WPPTabHeaderItem")
);
const SonicTabHeaderItem = React.lazy(() =>
  import("../../sonicspace/components/Tabs/TabHeaderItem/SonicTabHeaderItem")
);

const TabHeaderItemWrapper = (props) => {
  const superBrandName = getSuperBrandName();

  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPTabHeaderItem {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicTabHeaderItem {...props} />
        </Suspense>
      );
  }
};

export default TabHeaderItemWrapper;
