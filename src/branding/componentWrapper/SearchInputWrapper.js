import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPSearchBar = React.lazy(() =>
  import("../wpp/components/SearchBar/WPPSearchBar")
);
const SonicSearchBar = React.lazy(() =>
  import("../sonicspace/components/SonicSearchBar/SonicSearchBar")
);

const superBrandName = getSuperBrandName();

const SearchInputWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <WPPSearchBar {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicSearchBar {...props} />
        </Suspense>
      );
  }
};

export default SearchInputWrapper;
