import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPSelect = React.lazy(() =>
  import("../wpp/components/Select/WPPSelect")
);
const SonicSelect = React.lazy(() =>
  import("../sonicspace/components/Select/SonicSelect")
);

const superBrandName = getSuperBrandName();

const SelectWrapper = (props) => {
  switch (superBrandName) {
    // case brandConstants.WPP:
    //   return (
    //     <Suspense fallback={<></>}>
    //       <WPPSelect {...props} />
    //     </Suspense>
    //   );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicSelect {...props} />
        </Suspense>
      );
  }
};

export default SelectWrapper;
