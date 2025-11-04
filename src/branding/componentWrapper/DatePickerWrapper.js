import React, { Suspense } from "react";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";

const WPPDatePicker = React.lazy(() =>
  import("../wpp/components/DatePicker/WPPDatePicker")
);
const SonicDatePicker = React.lazy(() =>
  import("../sonicspace/components/DatePicker/SonicDatePicker")
);

const superBrandName = getSuperBrandName();

const DatePickerWrapper = (props) => {
  switch (superBrandName) {
    case brandConstants.WPP:
      return (
        <Suspense fallback={<></>}>
          <SonicDatePicker {...props} />
        </Suspense>
      );

    default:
      return (
        <Suspense fallback={<></>}>
          <SonicDatePicker {...props} />
        </Suspense>
      );
  }
};

export default DatePickerWrapper;
