import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { withStyles } from "@mui/styles";
import React from "react";
import { connectCurrentRefinements } from "react-instantsearch-dom";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { toggleModalView } from "../../../redux/actions/layoutActions";
import SearchBarNewSearch from "../Searchbar/SearchBarNewSearch";

function Transition(props) {
  return <Slide direction="right" {...props} />;
}

const styles = {
  dialogPaper: {
    minHeight: "90vh",
    maxHeight: "90vh",
    backgroundColor: "rgba(0,0,0, 0.5)",
    boxShadow: "none",
    color: "var(--color-white)",
    overflow: "hidden",
  },
  dialogContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "-10rem",
  },
};

let isShowBPMSlider1 = true;

function clearSliderTxtInput() {
  if (isShowBPMSlider1)
    document.getElementsByClassName("custom-textInput")[0].value = "";
}

class NewSearchDialog extends React.Component {
  //this timeout helps clear refinements

  handleClickOpen = () => {
    clearSliderTxtInput();
    setTimeout(() => {
      this.props.toggleModal();
    }, 100);
  };

  handleClose = () => {
    this.props.toggleModal();
  };

  render() {
    const { classes, isOpen } = this.props;
    isShowBPMSlider1 = this.props.isShowBPMSlider;

    return (
      <div>
        <div onClick={this.handleClickOpen}>
          <CustomClearRefinements />
        </div>

        <Dialog
          fullWidth={true}
          maxWidth="xl"
          classes={{ paper: classes.dialogPaper }}
          open={isOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent classes={{ root: classes.dialogContent }}>
            <SearchBarNewSearch />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              style={{ color: "var(--color-white)", fontSize: "1.7rem" }}
            >
              <FormattedMessage id="results.newSearch.decline" />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const ClearRefinements = ({ items, refine }) => {
  setTimeout(function () {
    if (isShowBPMSlider1) {
      if (document.getElementsByClassName("custom-textInput").length > 0) {
        if (items.length === 1 && items[0].attribute === "tag_all") {
          clearSliderTxtInput();
        } else if (items.length < 1) {
          clearSliderTxtInput();
        }
      }
    }
  }, 1000);

  return (
    <button
      className="Dialog--btn"
      color="primary"
      onClick={() => {
        if (isShowBPMSlider1)
          document.getElementsByClassName("custom-textInput")[0].value = "";
        refine(items);
      }}
    >
      <FormattedMessage id="results.newSearch.button" />
    </button>
  );
};

const CustomClearRefinements = connectCurrentRefinements(ClearRefinements);

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(toggleModalView()),
  };
};

const mapStateToProps = (state) => {
  return {
    isOpen: state.layout.newSearchModalOpen,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(NewSearchDialog));
