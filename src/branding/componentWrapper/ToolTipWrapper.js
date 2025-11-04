import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPToolTip = React.lazy(() =>
  import("../wpp/components/ToolTip/WPPTooltip")
);
const SonicToolTip = React.lazy(() =>
  import("../sonicspace/components/ToolTip/SonicToolTip")
);

const superBrandName = getSuperBrandName();

const ToolTipWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPToolTip {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicToolTip {...props} />
        </Suspense>
      );
  }
};

export default ToolTipWrapper;
