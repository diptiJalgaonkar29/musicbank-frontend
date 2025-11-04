import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPButton = React.lazy(() =>
  import("../wpp/components/Button/WPPButton")
);
const SonicButton = React.lazy(() =>
  import("../sonicspace/components/Button/SonicButton")
);

const ButtonWrapper = (props) => {
  const superBrandName = getSuperBrandName(); // ✅ inside component

  let BrandButton;
  switch (superBrandName) {
    case brandConstants.WPP:
      BrandButton = WPPButton;
      break;
    default:
      BrandButton = SonicButton;
  }

  return (
    <Suspense fallback={<></>}>
      <BrandButton {...props}>{props?.children}</BrandButton>
    </Suspense>
  );
};

export default ButtonWrapper;
