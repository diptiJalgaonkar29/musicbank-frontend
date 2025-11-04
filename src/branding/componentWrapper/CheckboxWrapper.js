import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPCheckbox = React.lazy(() =>
  import("../wpp/components/Checkbox/WPPCheckbox")
);
const SonicCheckbox = React.lazy(() =>
  import("../sonicspace/components/Checkbox/SonicCheckbox")
);

const superBrandName = getSuperBrandName();

const CheckboxWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPCheckbox {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicCheckbox {...props} />
        </Suspense>
      );
  }
};

export default CheckboxWrapper;
