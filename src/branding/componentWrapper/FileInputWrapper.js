import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPFileInput = React.lazy(() =>
  import("../wpp/components/FileInput/WPPFileInput")
);
const SonicFileInput = React.lazy(() =>
  import("../sonicspace/components/FileInput/SonicFileInput")
);

const superBrandName = getSuperBrandName();

const FileInputWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPFileInput {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicFileInput {...props} />
        </Suspense>
      );
  }
};

export default FileInputWrapper;
