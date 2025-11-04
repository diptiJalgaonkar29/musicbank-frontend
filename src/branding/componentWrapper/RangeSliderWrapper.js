import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPRangeSlider = React.lazy(() =>
  import("../wpp/components/RangeSlider/WPPRangeSlider")
);
const SonicRangeSlider = React.lazy(() =>
  import("../sonicspace/components/RangeSlider/SonicRangeSlider")
);

const superBrandName = getSuperBrandName();

const RangeSliderWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPRangeSlider {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicRangeSlider {...props} />
        </Suspense>
      );
  }
};

export default RangeSliderWrapper;
