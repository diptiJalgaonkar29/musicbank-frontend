import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPSliderInput = React.lazy(() =>
  import("../wpp/components/SliderInput/WPPSliderInput")
);
const SonicSliderInput = React.lazy(() =>
  import("../sonicspace/components/SliderInput/SonicSliderInput")
);

const superBrandName = getSuperBrandName();

const SliderInputWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPSliderInput {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicSliderInput {...props} />
        </Suspense>
      );
  }
};

export default SliderInputWrapper;
