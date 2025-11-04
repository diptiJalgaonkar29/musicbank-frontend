import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { openMemberOverviewGuest } from '../../../redux/actions/playListMemberActions';
import { BrandingContext } from '../../../branding/provider/BrandingContext';

class PlaylistMembersGuest extends Component {
  state = {
    anchorEl: null,
    open: false,
    fullName: '',
    email: '',
  };

  handleMouseOver = (name, email) => (event) => {
    if (email != null) {
      const { currentTarget } = event;
      this.setState((state) => ({
        anchorEl: currentTarget,
        open: !state.open,
        fullName: email.substring(0, email.lastIndexOf('@')),
        email,
      }));
    }
  };

  handleMouseOut = () => {
    this.setState({
      anchorEl: null,
      open: false,
      fullName: '',
      email: '',
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
                isMobileProp
                  ? 'PlayListMembers__Mobile__container'
                  : 'PlayListMembers__container'
              }
              id={
                config.modules.UpdateUItoV2
                  ? 'ExternalPlayListMembers__wrapper'
                  : null
              }
            >
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
                          style={{ padding: '4px', fontSize: '13px' }}
                        >
                          <span>{fullName}</span>
                          <span>{email}</span>
                        </div>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
                <div className="PlayListMembers__heading">
                  <span className="PlayListMembers__container--title">{`External Members (${dataProp?.membersunregistered?.length})`}</span>
                  {dataProp?.membersunregistered?.length >= 1 && (
                    <p
                      className="PlayListMembers__container--title showAll"
                      onClick={this.props.openMemberOverviewModalGuest}
                    >
                      <FormattedMessage id="playlist.member.showAll" />
                    </p>
                  )}
                </div>
                <div className="PlayListMembers__members">
                  <ul className="PlayListMembers__Avatar--ul">
                    {dataProp?.membersunregistered?.length >= 1 ? (
                      dataProp?.membersunregistered?.map(
                        (member) =>
                          member.email != null && (
                            <li
                              className="PlayListMembers__Avatar--li"
                              onMouseEnter={this.handleMouseOver(
                                member.fullName,
                                member.email
                              )}
                              onMouseLeave={this.handleMouseOut}
                            >
                              {member.email.toUpperCase().charAt(0)}
                            </li>
                          )
                      )
                    ) : (
                      <p>
                        <FormattedMessage id="playlist.member.noMember" />{' '}
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
    openMemberOverviewModalGuest: () => dispatch(openMemberOverviewGuest()),
  };
};

export default connect(null, mapDispatchToProps)(PlaylistMembersGuest);
