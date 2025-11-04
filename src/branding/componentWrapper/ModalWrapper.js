// ModalWrapper.jsx
import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

/**
 * Import helpers — force a { default: Component } shape
 */
const importWPPModal = () =>
  import("../wpp/components/Modal/WPPModal").then((mod) => ({
    default: mod.WPPModal || mod.default,
  }));

const importSonicModal = () =>
  import("../sonicspace/components/Modal/SonicModal").then((mod) => ({
    default: mod.SonicModal || mod.default,
  }));

// Lazy components
const WPPModal = React.lazy(importWPPModal);
const SonicModal = React.lazy(importSonicModal);

const superBrandName = getSuperBrandName();

const ModalWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<div />}>
          <WPPModal {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<div />}>
          <SonicModal {...props} />
        </Suspense>
      );
  }
};

export default ModalWrapper;
