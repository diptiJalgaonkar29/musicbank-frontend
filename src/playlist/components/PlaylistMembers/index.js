import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { openMemberOverview } from "../../../redux/actions/playListMemberActions";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

//addition by Trupti-Wits

class PlaylistMembers extends Component {
  state = {
    anchorEl: null,
    open: false,
    fullName: "",
    email: "",
  };

  handleMouseOver = (name, email) => (event) => {
    const { currentTarget } = event;
    this.setState((state) => ({
      anchorEl: currentTarget,
      open: !state.open,
      fullName: name,
      email,
    }));
  };

  handleMouseOut = () => {
    this.setState({
      anchorEl: null,
      open: false,
      fullName: "",
      email: "",
    });
  };

  render() {
    const { dataProp, isMobileProp } = this.props;
    const { anchorEl, open, fullName, email } = this.state;

    return (
      <>
        <BrandingContext.Consumer>
          {({ config }) => (
            <div
              className={
                isMobileProp && window.innerWidth < 768
                  ? "PlayListMembers__Mobile__container"
                  : "PlayListMembers__container"
              }
              id={"RegisteredPlayListMembers__wrapper"}
            >
              {" "}
              <div className="PlayListMembers__wrapper">
                <Popper
                  open={open}
                  anchorEl={anchorEl}
                  placement="top"
                  transition
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper>
                        <div
                          className="PlayListMembers__popper"
                          style={{ padding: "4px", fontSize: "13px" }}
                        >
                          <span>{fullName}</span>
                          <span>{email}</span>
                        </div>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
                <div className="PlayListMembers__heading">
                  <span className="PlayListMembers__container--title">{`Registered Members (${dataProp?.members?.length})`}</span>
                  {dataProp?.members?.length >= 1 && (
                    <p
                      className="PlayListMembers__container--title showAll"
                      onClick={this.props.openMemberOverviewModal}
                    >
                      <FormattedMessage id="playlist.member.showAll" />
                    </p>
                  )}
                </div>
                <div className="PlayListMembers__members">
                  <ul className="PlayListMembers__Avatar--ul">
                    {dataProp?.members?.length >= 1 ? (
                      dataProp?.members?.map((member, i) => (
                        <li
                          key={"PlayListMembers__Avatar--li" + i}
                          className="PlayListMembers__Avatar--li"
                          onMouseEnter={this.handleMouseOver(
                            member.fullname,
                            member.email
                          )}
                          onMouseLeave={this.handleMouseOut}
                        >
                          {member.email.toUpperCase().charAt(0)}
                        </li>
                      ))
                    ) : (
                      <p>
                        <FormattedMessage id="playlist.member.noMember" />{" "}
                      </p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </BrandingContext.Consumer>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openMemberOverviewModal: () => dispatch(openMemberOverview()),
  };
};

export default connect(null, mapDispatchToProps)(PlaylistMembers);
