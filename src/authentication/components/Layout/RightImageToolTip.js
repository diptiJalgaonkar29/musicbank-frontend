import { withStyles } from "@mui/styles";
import { brandConstants } from "../../../common/utils/brandConstants";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { Tooltip } from "@mui/material";

const tooltipStyles = () => ({
  placementBottom: {
    left: "180px !important",
    top: "550px !important",
  },
});

const RightImageToolTip = ({ children, classes }) => {
  if (getSuperBrandName() !== brandConstants.SHELL) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      title="Imagined with AI. Young Asian woman in yellow jumper wearing headphones and speaking into a microphone."
      arrow
      classes={{
        popper: classes.placementBottom,
      }}
    >
      {children}
    </Tooltip>
  );
};

export default withStyles(tooltipStyles)(RightImageToolTip);
