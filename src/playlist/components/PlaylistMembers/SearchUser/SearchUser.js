// SOURCE: GOOGlE MATERIAL-UI //
// CREDITS TO @kentcdodds - DOWNSHIFT //
// EDITED FOR X-ROOT //

import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import { withStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Downshift from "downshift";
import deburr from "lodash/deburr";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { updateMemberIdsForm } from "../../../../redux/actions/playListMemberActions/index";
import { fetchUserName } from "../../../../redux/actions/searchActions/index";
import "../../../../_styles/InputWithWordCounter.css";

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      autoFocus
      InputProps={{
        disableUnderline: true,
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || "").indexOf(suggestion.fullname) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.id}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: "1.6rem",
      }}
    >
      {suggestion.email}{" "}
      <span style={{ color: "#9f0002", fontSize: "1.6rem" }}>
        {suggestion.alreadyMember && "Already Member"}
      </span>
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ email: PropTypes.string }).isRequired,
};

function getSuggestions(value, suggestions, existingMembers) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  // Filter existings members for playlist from suggestions
  // this will show only users wich are not already members of the playlist
  let filterdSuggestions = [];
  suggestions.map((suggestion) => {
    let exists = existingMembers.some((m) => m.id === suggestion.id);
    // CASE IF EXISTING MEMBER IS NOT PART OF SUGGESTIONS
    if (exists === false) {
      const modifiedSuggestion = {
        ...suggestion,
        alreadyMember: false,
      };
      return filterdSuggestions.push(modifiedSuggestion);
    } else if (exists === true) {
      const modifiedSuggestion = {
        ...suggestion,
        alreadyMember: true,
      };
      return filterdSuggestions.push(modifiedSuggestion);
    } else {
      return null;
    }
  });

  return inputLength === 0
    ? []
    : filterdSuggestions.filter((suggestion) => {
        //suggestions.filter will include all suggestions

        const keep =
          count < 5 && suggestion.email.toLowerCase().includes(inputValue);

        if (keep) {
          count += 1;
        }
        return keep;
      });
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "var(--font-primary) !important",
  },
  container: {
    flexGrow: 1,
    position: "relative",
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: 2,
    left: 2,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`,
    borderRadius: 0,
  },
  inputRoot: {
    flexWrap: "wrap",
    color: "#333",
    border: "1px solid #999",
    background: "var(--color-white)",
    outline: "0",
    borderRadius: "1px",
    fontFamily: "var(--font-primary) !important",
  },
  inputInput: {
    width: "auto",
    flexGrow: 1,
    boxSizing: "border-box",
    paddingLeft: "1.4rem",
    height: "100%",
    lineHeight: "2rem",
    fontSize: "2rem",
    fontFamily: "var(--font-primary) !important",
    "&::placeholder": {
      color: "#333",
    },
  },
  divider: {
    height: theme.spacing(2),
  },
});

class SearchForUserDownShift extends React.Component {
  state = {
    inputValue: "",
    selectedItem: [],
  };

  handleKeyDown = (event) => {
    const { inputValue, selectedItem } = this.state;
    if (
      selectedItem.length &&
      !inputValue.length &&
      event.key === "Backspace"
    ) {
      this.setState(
        {
          selectedItem: selectedItem.slice(0, selectedItem.length - 1),
        },
        () => {
          this.props.updateMemberIdToFormProp(this.state.selectedItem);
        }
      );
    }
  };

  handleInputChange = (event) => {
    const inputValue = event.target.value;
    // START FETCH AFTER USER TYPED IN 2 LETTERS
    if (inputValue.length === 2) {
      this.props.fetchUserNameProp(event.target.value);
    }
    this.setState({ inputValue: event.target.value });
  };

  handleChange = (item) => {
    let { selectedItem } = this.state;
    // CHECK FOR DUBLICATE OR ALREADY MEMER
    const dublicate = selectedItem.find((user) => user.id === item.id);
    if (dublicate || item.alreadyMember === true) {
      return;
    }

    if (selectedItem.indexOf(item.fullname) === -1) {
      selectedItem = [
        ...selectedItem,
        { fullname: item.fullname, id: item.id, email: item.email },
      ];
    }
    // ALSO ADD USER ID TO THE STATE
    this.setState(
      {
        inputValue: "",
        selectedItem,
      },
      () => {
        this.props.updateMemberIdToFormProp(this.state.selectedItem);
      }
    );
  };

  handleDelete = (item) => () => {
    this.setState(
      (state) => {
        const selectedItemUpdated = state.selectedItem.filter((user) => {
          return user.id !== item.id;
        });
        return { selectedItem: selectedItemUpdated };
      },
      () => {
        this.props.updateMemberIdToFormProp(this.state.selectedItem);
      }
    );
  };

  render() {
    const { classes, existingMembers, playlistData } = this.props;
    const { inputValue, selectedItem } = this.state;

    return (
      <div className={classes.root}>
        <Downshift
          id="add-multible-users"
          inputValue={inputValue}
          onChange={this.handleChange}
          selectedItem={selectedItem}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            selectedItem,
            highlightedIndex,
          }) => (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                InputProps: getInputProps({
                  startAdornment: selectedItem.map((item) => (
                    <Chip
                      key={item.id}
                      tabIndex={-1}
                      label={item.email}
                      className={classes.chip}
                      onDelete={this.handleDelete(item)}
                    />
                  )),
                  onChange: this.handleInputChange,
                  onKeyDown: this.handleKeyDown,
                  placeholder: "Enter names...",
                }),
              })}

              {isOpen ? (
                <Paper className={classes.paper} square>
                  {getSuggestions(
                    inputValue,
                    playlistData,
                    existingMembers
                  ).map((suggestion, index) => {
                    return renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({
                        item: {
                          fullname: suggestion.fullname,
                          email: suggestion.email,
                          id: suggestion.id,
                          alreadyMember: suggestion.alreadyMember,
                        },
                      }),
                      highlightedIndex,
                      selectedItem: selectedItem,
                    });
                  })}
                </Paper>
              ) : null}
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}

SearchForUserDownShift.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserNameProp: (data) => dispatch(fetchUserName(data)),
    updateMemberIdToFormProp: (arr) => dispatch(updateMemberIdsForm(arr)),
  };
};

const mapStateToProps = (state) => {
  return {
    playlistData: state.search.userSearch,
    existingMembers: state.playlist.PlaylistByIdData.members,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SearchForUserDownShift));
