// InputWrapper.jsx
import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

/**
 * Utility to pick correct export in case modules export differently.
 */
const pickExport = (mod, possibleNames = []) => {
  if (!mod) return null;
  if (mod.default) return mod.default;
  for (const n of possibleNames) {
    if (mod[n]) return mod[n];
  }
  if (typeof mod === "function") return mod;
  return (props) => <input {...props} />;
};

/**
 * Lazy imports for WPP and Sonic input components.
 */
const WPPInput = React.lazy(() =>
  import("../wpp/components/Input/WPPInput").then((m) => ({
    default: pickExport(m, ["WPPInput", "WppInput", "Input"]),
  }))
);

const SonicInput = React.lazy(() =>
  import("../sonicspace/components/Input/SonicInput").then((m) => ({
    default: pickExport(m, ["SonicInput", "Sonic", "Input"]),
  }))
);

const InputWrapper = (props) => {
  const superBrandName = getSuperBrandName(); // <-- moved inside component

  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<input {...props} />}>
          <WPPInput {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<input {...props} />}>
          <SonicInput {...props} />
        </Suspense>
      );
  }
};

export default InputWrapper;
