import React from "react";

import { withStyles } from "@mui/styles";

import Dialog from "@mui/material/Dialog";

// import AddNewMemberModalTab from "../../../components/PlaylistMembers/AddNewMemberModal/AddNewMemberModalTab";
// import AddNewMemberExternalModalTab from "../../../components/PlaylistMembers/AddNewMemberExternalModal/AddNewMemberExternalModalTab";

// import "./ShareTabsPlaylistModal.css"

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
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
};

/* const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}); */

class CopyLinkListModal extends React.Component {
  //   state = {
  //     value: 0,
  //   };

  //   handleChange = (event, value) => {
  //     this.setState({ value });
  //   };

  //   onClickElement = (element) => {
  //       this.setState({
  //           dialogOpen: true,
  //           selectedElement: element
  //       });
  //   }

  render() {
    //const { classes } = this.props;
    // const { value } = this.state;
    // const {classes, openProp} = this.props;

    return (
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        // classes={{ paper: classes.dialogPaper }}
        // open={openProp}
        // TransitionComponent={Transition}
        // onOpen={this.handleReset}
        // onClose={this.handleClose}
      >
        <h1>this is dialog</h1>
        {/* <DialogTitle className={classes.DialogHeading}>
            {" "}
            <FormattedMessage id="playlist.member.invite" />
        </DialogTitle> */}
      </Dialog>
    );
  }
}

// CopyLinkModal.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(CopyLinkListModal);
