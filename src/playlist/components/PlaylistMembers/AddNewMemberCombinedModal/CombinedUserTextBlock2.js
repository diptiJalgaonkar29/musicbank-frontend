/* eslint-disable no-use-before-define */
import React from "react";
import { connect } from "react-redux";
//import Chip from "@mui/material/Chip";
import Autocomplete, {
  createFilterOptions,
} from "@mui/material/Autocomplete";
//import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import validator from "validator";
import UserService, { User } from "../../../../user/services/UserService";

import { fetchUserName } from "../../../../redux/actions/searchActions";
import { updateMemberCombineIdsForm } from "../../../../redux/actions/playListMemberActions/index";

import "./CombinedUserTextBlock.css";
// import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";
// import ChipWrapper from "../../../../branding/componentWrapper/ChipWrapper";

import { withStyles } from "@mui/styles";

const CustomAutocomplete = withStyles({
  tag: {
    position: "relative",
    zIndex: 0,
    "& .MuiChip-deleteIcon": {
      fill: "var(--color-bg)",
      scale: 1.2,
    },
    "&:after": {
      content: '""',
      right: 10,
      top: 9,
      height: 12,
      width: 12,
      position: "absolute",
      backgroundColor: "var(--color-white)",
      zIndex: -1,
    },
  },
})(Autocomplete);

//https://codesandbox.io/s/material-demo-forked-w6ynx?file=/demo.js:3776-3797
//https://material-ui.com/api/autocomplete/

/* const useStyles = makeStyles((theme) => ({
  root: {
    width: 500, 
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
})); */

const filter = createFilterOptions();
//let userList;
//let inviteUserList = [];
//const [open, setOpen] = React.useState(false);
//const [options, setOptions] = React.useState([]);
//const loading = open && options.length === 0;

class CombinedUserTextBlock2 extends React.Component {
  state = {
    inputValue: "",
    selectedItem: [],
    inviteUserList: [],
    //userList: this.props.userList,
    userList: [],
    errorText: "",
    searchValue: "",
  };

  render() {
    const { existingMembers, existingMembersUnregistered } = this.props;

    return (
      <div className="combinedUserTextBlock">
        <CustomAutocomplete
          multiple
          freeSolo
          id="combinedUserList"
          size="medium"
          debug="true"
          value={this.state.inviteUserList}
          filterSelectedOptions
          autoComplete="true"
          options={this.state.userList}
          getOptionDisabled={(option) =>
            existingMembers?.some(
              (m) => m.email?.trim() === option.email?.trim()
            ) ||
            existingMembersUnregistered?.some(
              (m) => m.email?.trim() === option.email?.trim()
            ) ||
            this.state.inviteUserList?.some(
              (m) => m.email?.trim() === option.email?.trim()
            )
          }
          filterOptions={(options, params) => {
            !!this.state.errorText && this.setState({ errorText: "" });
            const inputValue = params?.inputValue?.trim();
            if (
              inputValue.length === 2 &&
              inputValue !== this.state.searchValue
            ) {
              UserService.getAllByUserNameQuery(inputValue).then((result) => {
                this.setState({ userList: result });
                this.setState({ searchValue: inputValue });
              });
            }
            if (options !== undefined) {
              //if (params.inputValue.length > 2) {
              //console.log("filteroptions " + options, params)
              const filtered = filter(options, params);

              // Suggest the creation of a new value
              //if (params.inputValue !== "") {
              if (params.inputValue.length > 2) {
                const trimmedInputValue = params?.inputValue?.trim();
                filtered.push({
                  inputValue: trimmedInputValue,
                  email: trimmedInputValue,
                  //title: `Add "${params.inputValue}"`
                });
              }
              return filtered;
            }
          }}
          getOptionLabel={(option) => {
            if (
              existingMembers?.some(
                (m) => m.email?.trim() === option.email?.trim()
              ) ||
              existingMembersUnregistered?.some(
                (m) => m.email?.trim() === option.email?.trim()
              )
            ) {
              return option.email + " (Already a Member)";
              //return (<>${option.email}<span style="color:red;right: 10px;position: absolute;">(Already a Member)</span></>)
            } else {
              // Value selected with enter, right from the input
              if (typeof option === "string") {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                //return option.inputValue;
                return option.email;
              }
              // Regular option
              return option.email;
            }
          }}
          renderInput={(params) => {
            return (
              <TextField
                className="combinedUserOptions"
                {...params}
                type="email"
                variant="standard"
                placeholder="email"
              />
            );
          }}
          onChange={this.handleChange.bind(this)}
        />
        {!!this.state.errorText && (
          <p className="errorBox">{this.state.errorText}</p>
        )}
      </div>
    );
  }

  handleChange(event, value) {
    this.setState({ errorText: "" });
    this.setState({ searchValue: "" });
    if (event.target.textContent !== "") {
      let emailVal = event.target.textContent?.trim();
      if (validator.isEmail(emailVal)) {
        if (!this.state.inviteUserList?.some((m) => m.email === value)) {
          this.updateInviteUserList(value);
        }
      } else {
        this.setState({ errorText: "Invalid email: " + emailVal });
      }
    } else {
      let emailVal = event.target.value?.trim();
      this.setState({ inputValue: emailVal });
      if (emailVal !== "" && emailVal !== undefined) {
        this.setState({ errorText: "" });
        if (validator.isEmail(emailVal)) {
          if (
            !this.props.existingMembersUnregistered?.some(
              (m) => m.email?.trim() === emailVal
            ) &&
            !this.state.inviteUserList?.some(
              (m) => m.email?.trim() === emailVal
            )
          ) {
            this.setState({ errorText: "" });
            this.updateInviteUserList(value);
          }
        } else {
          this.setState({ errorText: "Invalid email: " + emailVal });
          //return false;
        }
      } else {
        if (!this.state.inviteUserList?.some((m) => m.email === value))
          this.updateInviteUserList(value);
      }
    }
    //this.setState({ inviteUserList: value });
  }

  isValid(email) {
    let error = null;

    if (this.isInList(email)) {
      error = `${email} has already been added.`;
    }

    if (this.isInSharedList(email)) {
      error = `${email} is already a member.`;
    }

    if (!this.isEmail(email)) {
      error = `${email} is not a valid email address.`;
    }

    if (error) {
      this.setState({ errorText: error });
      return false;
    }
    return true;
  }

  isInList(email) {
    return this.state.items.includes(email);
  }

  isInSharedList(email) {
    var dataObjU = this.props.existingMembersUnregistered;
    var dataObjR = this.props.existingMembers;
    const foundU = dataObjU?.some((el) => el.email?.trim() === email?.trim());
    const foundR = dataObjR?.some((el) => el.email?.trim() === email?.trim());
    if (foundU || foundR)
      //dataObj.push({ email: email });
      return true;

    //var chkList = dataObj.filter(obj => (obj.email === email));
    //console.log("chklist "+chkList)
  }

  isEmail(email) {
    //return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    return validator.isEmail(email);
  }

  updateInviteUserList(value) {
    console.log("value", value);
    console.log("adding new user", value?.[value?.length - 1]?.email);
    const newUserEmail = value?.[value?.length - 1]?.email;
    UserService.getAllByUserNameQuery(newUserEmail)
      .then((result) => {
        console.log("result", result);
        const updatedValue = [...value];
        if (result[0]?.email?.trim() === newUserEmail?.trim()) {
          const newUpdatedUser = new User(
            result[0]?.id,
            result[0]?.fullname,
            result[0]?.email
          );
          updatedValue[updatedValue.length - 1] = newUpdatedUser;
        }
        console.log("updatedValue", updatedValue);
        this.setState({ inviteUserList: updatedValue }, () => {
          this.props.updateMemberCombineIdToFormProp(this.state.inviteUserList);
        });
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ inviteUserList: value }, () => {
          this.props.updateMemberCombineIdToFormProp(this.state.inviteUserList);
        });
      });
  }

  handleChange1(item) {
    // console.log(
    //   "handlechange1 " + item.target.value + "|" + item.target.innerText
    // );
  }

  onChange(event) {
    //if (event.target.value.match(phoneRegex)) {

    if (validator.isEmail(event.target.value?.trim())) {
      this.setState({ errorText: "" });
    } else {
      this.setState({ errorText: "Invalid email" });
    }
  }

  handleInputChange(event) {
    const inputValue = event.target.value?.trim();
    // START FETCH AFTER USER TYPED IN 2 LETTERS
    if (inputValue.length === 2) {
      fetchUserName(inputValue);
    }
    this.setState({ inputValue: inputValue });
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserNameProp: (data) => dispatch(fetchUserName(data)),
    updateMemberCombineIdToFormProp: (arr) =>
      dispatch(updateMemberCombineIdsForm(arr)),
  };
};

const mapStateToProps = (state) => {
  return {
    playlistData: state.search.userSearch,
    existingMembers: state.playlist.PlaylistByIdData?.members || state.playlist.playlistToShare?.members,
    existingMembersUnregistered:
      state.playlist.PlaylistByIdData?.membersunregistered || state.playlist.playlistToShare?.membersunregistered,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CombinedUserTextBlock2);
