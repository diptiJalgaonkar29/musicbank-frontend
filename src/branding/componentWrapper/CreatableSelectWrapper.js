import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPCreatableSelect = React.lazy(() =>
  import("../wpp/components/CreatableSelect/WPPCreatableSelect")
);
const SonicCreatableSelect = React.lazy(() =>
  import("../sonicspace/components/CreatableSelect/SonicCreatableSelect")
);

const superBrandName = getSuperBrandName();

const CreatableSelectWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPCreatableSelect {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicCreatableSelect {...props} />
        </Suspense>
      );
  }
};

export default CreatableSelectWrapper;
