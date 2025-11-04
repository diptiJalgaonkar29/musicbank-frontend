import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPAccordion = React.lazy(() =>
  import("../wpp/components/Accordion/WPPAccordion")
);
const SonicAccordion = React.lazy(() =>
  import("../sonicspace/components/Accordion/SonicAccordion")
);

const superBrandName = getSuperBrandName();

const AccordionWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <SonicAccordion {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicAccordion {...props} />
        </Suspense>
      );
  }
};

export default AccordionWrapper;
