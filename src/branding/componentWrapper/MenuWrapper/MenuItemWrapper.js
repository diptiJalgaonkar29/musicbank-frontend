import React, { Suspense } from "react";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";

// Lazy loading SonicMenuItem
const SonicMenuItem = React.lazy(() =>
  import("../../sonicspace/components/Menu/MenuItem/SonicMenuItem")
);

const MenuItemWrapper = (props) => {
  const superBrandName = getSuperBrandName();

  switch (superBrandName) {
    case brandConstants.WPP:
      // return <WPPMenuItem {...props} />;
      return (
        <Suspense fallback={<></>}>
          <SonicMenuItem {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicMenuItem {...props} />
        </Suspense>
      );
  }
};

export default MenuItemWrapper;
