import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import Moment from "react-moment";
import "../../../../_styles/Comments.css";
import ChatService from "../../../services/ChatService";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";
import { getUserId } from "../../../../common/utils/getUserAuthMeta";

const transformTimestamp = (change_timestamp) => {
  return <Moment fromNow>{change_timestamp}</Moment>;
};

const checkifEdited = (cTimestamp, nTimestamp) => {
  if (!cTimestamp || !nTimestamp) {
    return null;
  }
  const indicator = cTimestamp === nTimestamp;
  if (indicator === false) {
    return <span> (edited) </span>;
  }
};

const ChatElementContent = (dataProp, type) => {
  return (
    <div>
      <div
        className="Comment__message--data"
        style={{
          textAlign: dataProp ? "right" : "left",
        }}
      >
        {dataProp ? (
          <React.Fragment>
            <span className="Comment__message--data--time">
              {transformTimestamp(dataProp.change_timestamp)}
              {checkifEdited(dataProp.change_timestamp, dataProp.new_timestamp)}
            </span>
            <span className="Comment__message--data--name">
              {dataProp.user_fullname}
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span className="Comment__message--data--name">
              {dataProp.user_fullname}
            </span>
            <span className="Comment__message--data--time">
              {transformTimestamp(dataProp.change_timestamp)}
            </span>
          </React.Fragment>
        )}
        <div
          className="Comment__message--message"
          style={{
            float: dataProp ? "right" : "left",
          }}
        >
          {type === "read" ? dataProp.message : " "}
        </div>
      </div>
    </div>
  );
};

class CommentElement extends Component {
  state = {
    editMode: false,
    deleteMode: false,
    value: "",
  };
  editMode = () => {
    this.setState({
      editMode: true,
      value: this.props.dataProp.message,
    });
  };

  editModeOff = () => {
    this.setState({
      editMode: false,
    });
  };

  deleteModeOn = () => {
    this.setState({
      deleteMode: true,
    });
  };

  deleteModeOff = () => {
    this.setState({
      deleteMode: false,
    });
  };

  submitDelete = () => {
    const commentID = this.props.dataProp.id;
    const playlistId = this.props.playlistID.id;
    ChatService.remove(commentID).then(() =>
      this.setState(
        {
          deleteMode: false,
        },
        () => {
          this.props.getCommentsProp(playlistId);
        }
      )
    );
  };

  updateCommentHandler = () => {
    const commentID = this.props.dataProp.id;
    const playlistId = this.props.playlistID.id;
    ChatService.update(commentID, playlistId, this.state.value).then(() =>
      this.setState(
        {
          editMode: false,
        },
        () => {
          // UPDATE THE COMMENT SECTIN DATA
          this.props.getCommentsProp(playlistId);
        }
      )
    );
  };

  handleInputChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { dataProp } = this.props;
    const { editMode, value, deleteMode } = this.state;
    let userID = Number(getUserId());

    let content = (
      <li
        className="Comment_element clearfix"
        style={{
          marginLeft: dataProp?.userId === userID ? "40px" : "0px",
          marginRight: dataProp?.userId === userID ? "0px" : "40px",
        }}
      >
        <div className="Comment__messageLborder">
          {ChatElementContent(dataProp, "read")}
        </div>
      </li>
    );

    if (dataProp?.userId === userID) {
      content = (
        <li
          className="Comment_element clearfix"
          style={{
            borderRight:
              dataProp?.userId === userID && "6px solid var(--color-primary)",
            borderLeft:
              (dataProp?.userId === userID) === false &&
              "6px solid var(--color-secondary)",
            marginLeft: dataProp?.userId === userID ? "40px" : "0px",
            marginRight: dataProp?.userId === userID ? "0px" : "40px",
          }}
        >
          <div className="Comment__messageRborder">
            {ChatElementContent(dataProp, "read")}
            {deleteMode ? (
              <div className={deleteMode ? "Comment_element--Shadow" : null}>
                <div className="Comment_element--extraVisible">
                  <p>
                    <FormattedMessage id="playlist.comment.deleteQuestion" />
                  </p>
                  <span onClick={this.submitDelete} className="activeColor">
                    <FormattedMessage id="playlist.comment.deleteAccept" />
                  </span>
                  <span onClick={this.deleteModeOff}>Cancel</span>
                </div>
              </div>
            ) : (
              <div className="Comment_element--extra">
                {/* <DeleteOutlinedIcon
                  className="Comment_element--Icon"
                  onClick={this.deleteModeOn}
                /> */}
                <IconButtonWrapper
                  icon="Trash"
                  className="Comment_element--Icon"
                  onClick={this.deleteModeOn}
                />
                <IconButtonWrapper
                  icon="Edit"
                  className="Comment_element--Icon"
                  onClick={this.editMode}
                />
                {/* <EditIcon
                  className="Comment_element--Icon"
                  onClick={this.editMode}
                /> */}
              </div>
            )}
          </div>
        </li>
      );
    }

    if (editMode) {
      content = (
        <li
          className="Comment_element clearfix"
          style={{
            borderRight:
              dataProp?.userId === userID && "6px solid var(--color-primary)",
            borderLeft:
              (dataProp?.userId === userID) === false &&
              "6px solid var(--color-secondary)",
            marginLeft: dataProp?.userId === userID ? "40px" : "0px",
            marginRight: dataProp?.userId === userID ? "0px" : "40px",
          }}
        >
          <div className="Comment__messageRborder">
            <div>
              <div
                className="Comment__message--data"
                style={{
                  textAlign: dataProp?.userId === userID ? "right" : "left",
                }}
              >
                <React.Fragment>
                  <span className="Comment__message--data--time">
                    {transformTimestamp(dataProp.change_timestamp)}
                    {checkifEdited(
                      dataProp.change_timestamp,
                      dataProp.new_timestamp
                    )}
                  </span>
                  <span className="Comment__message--data--name">
                    {dataProp.user_fullname}
                  </span>
                </React.Fragment>

                <div
                  className="Comment__message--message"
                  style={{
                    float: dataProp?.userId === userID ? "right" : "left",
                    marginBottom: "0px",
                  }}
                >
                  <textarea
                    className="PlaylistDescription__Name--textarea"
                    style={{
                      height: "10rem",
                      fontSize: "1.6rem",
                    }}
                    type="text"
                    autoFocus
                    value={value}
                    onChange={this.handleInputChange}
                  />
                  <div
                    className="Comment_element--extraVisible"
                    style={{
                      paddingLeft: "0px",
                    }}
                  >
                    <span
                      onClick={this.updateCommentHandler}
                      className="activeColor"
                    >
                      <FormattedMessage id="playlist.comment.editAccept" />
                    </span>
                    <span onClick={this.editModeOff}>
                      <FormattedMessage id="playlist.comment.editDecline" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      );
    }
    return <>{content}</>;
  }
}

export default CommentElement;
