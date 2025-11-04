import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPToggle = React.lazy(() =>
  import("../wpp/components/Toggle/WPPToggle")
);
const SonicToggle = React.lazy(() =>
  import("../sonicspace/components/Toggle/SonicToggle")
);

const superBrandName = getSuperBrandName();

const ToggleWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPToggle {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicToggle {...props} />
        </Suspense>
      );
  }
};

export default ToggleWrapper;
