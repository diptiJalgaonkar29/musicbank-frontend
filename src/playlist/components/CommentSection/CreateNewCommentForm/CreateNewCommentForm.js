import Button from "@mui/material/Button";
import { Field, Formik } from "formik";
import React from "react";
import { FormattedMessage } from "react-intl";
import * as Yup from "yup";
//Helper Functions
import ChatService from "../../../services/ChatService";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";
import "./commentPop.css";
import commentIcon from "../../../../static/slick-next-svg.svg";
import { ReactComponent as RightArrow } from "../../../../static/rightArrow.svg";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";

const SignupSchema = Yup.object().shape({
  comment: Yup.string()
    .trim()
    // .trim("Too Short!")
    // .min(2, "Too Short!")
    // .max(300, "Too Long!")
    .required("Required"),
});

class CreateNewCommentForm extends React.Component {
  render() {
    const { playlistID } = this.props;
    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <>
            <React.Fragment>
              {playlistID ? (
                <React.Fragment>
                  <Formik
                    initialValues={{ comment: "" }}
                    validationSchema={SignupSchema}
                    onSubmit={(values, actions) => {
                      ChatService.add(playlistID.id, values.comment)
                        .then(() => {
                          this.props.getCommentsProp(playlistID.id);
                          this.props.ScrollToBottomProp();

                          actions.resetForm({});
                          actions.setSubmitting(false);
                          actions.setStatus({ success: true });
                        })

                        .catch((e) => console.error("e", e));
                    }}
                    render={(props) => (
                      <form
                        onSubmit={props.handleSubmit}
                        className="CommentSections__newComment--wrapper"
                      >
                        <Field
                          placeholder="Type your Message"
                          id="comment"
                          size="s"
                          className="comment_input"
                          name="comment"
                          type="text"
                          component={InputWrapper}
                        />
                        <IconButtonWrapper
                          type="submit"
                          disabled={
                            props.isSubmitting || !props.isValid || !props.dirty
                          }
                          onClick={props.handleSubmit}
                          className={"submit_chat"}
                          icon="RightArrow"
                        />
                      </form>
                    )}
                  />
                  {this.renderCommentPopup()}
                </React.Fragment>
              ) : null}
            </React.Fragment>
          </>
        )}
      </BrandingContext.Consumer>
    );
  }

  renderCommentPopup() {
    if (localStorage.getItem("commentApproved") !== "complete") {
      return (
        <BrandingContext.Consumer>
          {({ config }) => (
            <>
              {config.modules.CommentsPopup && (
                <div className="commentConfirmPopHolder">
                  <div className="commentConfirmPop">
                    <p>
                      <FormattedMessage id="playlist.comment.confirmText" />
                    </p>
                    <div className="cc_BtnBox">
                      <div className="cc_boxL">
                        <input
                          id="cc_check"
                          type="checkbox"
                          name="allowComment"
                          value=""
                        />
                        <label htmlFor="allowComment">
                          <FormattedMessage id="playlist.comment.confirmMsg" />
                        </label>
                      </div>
                      <div className="cc_boxR">
                        <button
                          className="TpTc__dl-btn cc_Btn"
                          onClick={this.checkCommentConfirmStatus}
                        >
                          <FormattedMessage id="playlist.comment.confirmOk" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </BrandingContext.Consumer>
      );
    }
  }

  checkCommentConfirmStatus() {
    if (document.getElementById("cc_check") != null) {
      if (document.getElementById("cc_check").checked === true) {
        localStorage.setItem("commentApproved", "complete");
      } else {
        localStorage.setItem("commentApproved", "partial");
      }
    }

    document.getElementsByClassName("commentConfirmPop")[0].style.display =
      "none";
    localStorage.setItem("commentShown", "true");
  }

  showHideCommentConfirmPopup(_showPopup) {
    if (_showPopup) {
      if (
        localStorage.getItem("commentApproved") !== "complete" &&
        (localStorage.getItem("commentShown") === "false" ||
          localStorage.getItem("commentShown") === null)
      ) {
        document.getElementsByClassName("commentConfirmPop")[0].style.display =
          "block";
        document.getElementById("cc_check").focus();
      }
    }
  }
}

export default CreateNewCommentForm;
