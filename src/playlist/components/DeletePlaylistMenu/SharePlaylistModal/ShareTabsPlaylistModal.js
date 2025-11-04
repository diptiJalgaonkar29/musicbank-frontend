import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";
import "./ShareTabsPlaylistModal.css";
import ModalWrapper from "../../../../branding/componentWrapper/ModalWrapper";
import SharePlaylistTabs from "../../SharePlaylistTabs/SharePlaylistTabs";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: "10px" }}>
      {props.children}
    </Typography>
  );
}

function Transition(props) {
  return <Slide direction="top" {...props} />;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = {
  dialogPaper: {
    minHeight: "0px",
    backgroundColor: "var(--color-card)",
    boxShadow: "none",
    color: "var(--color-white)",
    borderRadius: "0px",
  },
  dialogContent: {
    paddingTop: "3rem",
    paddingBottom: "0px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "flex-start",
  },
  DialogHeading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px dotted grey",
    "& h2": {
      color: "var(--color-white)",
      fontSize: "1.8rem",
    },
  },
  DialogActions: {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
    boxSizing: "border-box",
    padding: "2.4rem 2.4rem",
  },
  TabsContainer: {
    fontFamily: "var(--font-primary-bold)",
    fontSize: "15px",
  },
  root: {
    //background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: "var(--color-white)",
    //height: 48,
    padding: "0px",
    // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    width: "100%",
  },
};

class ShareTabsPlaylistModal extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    //const { classes } = this.props;
    const { value } = this.state;
    const { classes, openProp } = this.props;


    console.log("this.props.PlaylistByIdData", this.props.PlaylistByIdData)

    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <ModalWrapper
            isOpen={openProp}
            onClose={this.props.closeHandlerProp}
            title=""
            disableCloseIcon={true}
          >
            <div className={classes.root}>
              <SharePlaylistTabs
                playlistIdProp={this.props.PlaylistByIdData}
                closeHandlerProp={this.props.closeHandlerProp}
                ShareGeneralLink={config.modules.ShareGeneralLink}
              />
            </div>
          </ModalWrapper>
        )}
      </BrandingContext.Consumer>
    );
  }
}

ShareTabsPlaylistModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShareTabsPlaylistModal);
