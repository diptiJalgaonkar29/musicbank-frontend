import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPChip = React.lazy(() => import("../wpp/components/Chip/WPPChip"));
const SonicChip = React.lazy(() =>
  import("../sonicspace/components/Chip/SonicChip")
);

const superBrandName = getSuperBrandName();

const ChipWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPChip {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicChip {...props} />
        </Suspense>
      );
  }
};

export default ChipWrapper;
