import React, { Suspense } from "react";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";

// Lazy loading SonicMenu
const SonicMenu = React.lazy(() =>
  import("../../sonicspace/components/Menu/SonicMenu")
);

const MenuWrapper = (props) => {
  const superBrandName = getSuperBrandName();

  switch (superBrandName) {
    case brandConstants.WPP:
      // return <WPPMenu {...props} />;
      return (
        <Suspense fallback={<></>}>
          <SonicMenu {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicMenu {...props} />
        </Suspense>
      );
  }
};

export default MenuWrapper;
