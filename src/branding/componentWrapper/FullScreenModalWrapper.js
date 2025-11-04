// ModalWrapper.jsx
import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

/**
 * Import helpers — force a { default: Component } shape
 */
const importFullScreenWPPModal = () =>
  import("../wpp/components/FullScreenModal/WPPFullScreenModal").then((mod) => ({
    default: mod.FullScreenWPPModal || mod.default,
  }));

const importFullScreenSonicModal = () =>
  import("../sonicspace/components/FullScreenModal/SonicFullScreenModal").then((mod) => ({
    default: mod.FullScreenSonicModal || mod.default,
  }));

// Lazy components
const FullScreenWPPModal = React.lazy(importFullScreenWPPModal);
const FullScreenSonicModal = React.lazy(importFullScreenSonicModal);

const superBrandName = getSuperBrandName();

const FullScreenModalWrapper = (props) => {
  console.log("FullScreenModalWrapper",props)
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<div />}>
          <FullScreenWPPModal {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<div />}>
          <FullScreenSonicModal {...props} />
        </Suspense>
      );
  }
};

export default FullScreenModalWrapper;
