// TextAreaWrapper.jsx
import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

/**
 * Import helpers — normalize to { default: Component }
 */
const importWPPTextArea = () =>
  import("../wpp/components/TextArea/WPPTextArea").then((mod) => ({
    default: mod.WPPTextArea || mod.default,
  }));

const importSonicTextArea = () =>
  import("../sonicspace/components/TextArea/SonicTextArea").then((mod) => ({
    default: mod.SonicTextArea || mod.default,
  }));

// Lazy versions
const WPPTextArea = React.lazy(importWPPTextArea);
const SonicTextArea = React.lazy(importSonicTextArea);

const superBrandName = getSuperBrandName();

const TextAreaWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<textarea {...props} />}>
          <WPPTextArea {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<textarea {...props} />}>
          <SonicTextArea {...props} />
        </Suspense>
      );
  }
};

export default TextAreaWrapper;
