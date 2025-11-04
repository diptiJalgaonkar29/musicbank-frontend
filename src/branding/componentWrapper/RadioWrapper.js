import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPRadio = React.lazy(() => import("../wpp/components/Radio/WPPRadio"));
const SonicRadio = React.lazy(() =>
  import("../sonicspace/components/Radio/SonicRadio")
);

const superBrandName = getSuperBrandName();

const RadioWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPRadio {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicRadio {...props} />
        </Suspense>
      );
  }
};

export default RadioWrapper;
