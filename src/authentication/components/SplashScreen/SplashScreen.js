import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { compose } from "redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { SSOButton } from "../../../common/components/Button/SSOButton";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

const styles = () => ({
  dialogPaper: {
    height: "auto",
    backgroundColor: "var(--color-card)",
    boxShadow: "none",
    color: "var(--color-white)",
    borderRadius: "0px",
    overflow: "hidden",
  },
  dialogPaperV2: {
    height: "auto",
    backgroundColor: "var(--color-card)",
    boxShadow: "none",
    color: "var(--color-white)",
    overflow: "hidden",
    borderRadius: "10px",
  },
  dialogContent: {
    padding: "5rem",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "flex-start",
    fontSize: "1.6rem",
    lineHeight: "2rem",
  },
  DialogHeading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px dotted grey",
    "& h2": {
      color: "var(--color-var(--color-white))",
      fontSize: "2.8rem",
    },
  },
  DialogActions: {
    display: "flex",
    marginBottom: "2rem",
    justifyContent: "center",
    boxSizing: "border-box",
    padding: "0 20rem",
  },
  closeBtnV2: {
    color: "rgb(245, 255, 244)",
    border: "none",
    cursor: "pointer",
    height: "40px",
    margin: "20px 0",
    padding: "10px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "25px",
    backgroundColor: "var(--color-primary)",
  },
});
class SplashScreen extends Component {
  state = {
    openModal: true,
  };
  handleClose = () => {
    this.setState({ openModal: false });
  };
  render() {
    const { classes } = this.props;

    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <>
            <Dialog
              fullWidth={true}
              maxWidth="md"
              classes={{
                paper: config?.modules?.UpdateUItoV2
                  ? classes.dialogPaperV2
                  : classes.dialogPaper,
              }}
              open={this.state.openModal}
              onClose={this.handleClose}
            >
              <DialogTitle className={classes.DialogHeading}>
                <FormattedMessage id="auth.login.page.splashScreenHeader" />
              </DialogTitle>

              <DialogContent classes={{ root: classes.dialogContent }}>
                <FormattedMessage id="auth.login.page.splashScreenContent" />
              </DialogContent>
              <DialogActions className={classes.DialogActions}>
                {config?.modules?.UpdateUItoV2 ? (
                  <button
                    className={
                      config?.modules?.UpdateUItoV2
                        ? classes.closeBtnV2
                        : classes.closeBtn
                    }
                    onClick={this.handleClose}
                  >
                    <FormattedMessage id="auth.login.page.splashScreenCloseBtnText" />
                  </button>
                ) : (
                  <SSOButton
                    text={
                      <FormattedMessage id="auth.login.page.splashScreenCloseBtnText" />
                    }
                    width={"auto"}
                    onClick={this.handleClose}
                  />
                )}
              </DialogActions>
            </Dialog>
          </>
        )}
      </BrandingContext.Consumer>
    );
  }
}

export default compose(withStyles(styles))(SplashScreen);
