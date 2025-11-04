import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPProgressBar = React.lazy(() =>
  import("../wpp/components/ProgressBar/WPPProgressBar")
);
const SonicProgressBar = React.lazy(() =>
  import("../sonicspace/components/ProgressBar/SonicProgressBar")
);

const superBrandName = getSuperBrandName();

const ProgressBarWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPProgressBar {...props}>{props?.children}</WPPProgressBar>
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicProgressBar {...props}>{props?.children}</SonicProgressBar>
        </Suspense>
      );
  }
};

export default ProgressBarWrapper;
