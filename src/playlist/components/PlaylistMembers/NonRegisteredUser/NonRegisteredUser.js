import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validator from 'validator';
import { updateMemberExtIdsForm } from '../../../../redux/actions/playListMemberActions/index';

import './NonRegisteredUser.css';

class NonRegisteredUser extends React.Component {
  state = {
    items: [],
    value: '',
    error: null,
    playlistSharedData: this.props.playlistIdProp,
  };

  handleKeyDown = (evt) => {
    if (['Enter', 'Tab', ',', ' '].includes(evt.key)) {
      evt.preventDefault();

      var value = this.state.value.trim();

      if (value && this.isValid(value)) {
        this.setState(
          {
            items: [...this.state.items, this.state.value],
            value: '',
          },
          () => {
            this.props.updateMemberExtIdToFormProp(this.state.items);
          }
        );
      }
    }
  };

  handleChange = (evt) => {
    this.setState(
      {
        value: evt.target.value,
        error: null,
      },
      () => {
        this.props.updateMemberExtIdToFormProp(this.state.value);
      }
    );
  };

  handleDelete = (item) => {
    this.setState(
      {
        items: this.state.items.filter((i) => i !== item),
      },
      () => {
        this.props.updateMemberExtIdToFormProp(this.state.items);
      }
    );
  };

  handlePaste = (evt) => {
    evt.preventDefault();

    var paste = evt.clipboardData.getData('text');
    var emails = paste.match(new RegExp(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g));

    if (emails) {
      var toBeAdded = emails.filter((email) => !this.isInList(email));

      this.setState(
        {
          items: [...this.state.items, ...toBeAdded],
        },
        () => {
          this.props.updateMemberExtIdToFormProp(this.state.items);
        }
      );
    }
  };

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
      this.setState({ error });
      this.updateBtnStatus(false);
      return false;
    }

    this.updateBtnStatus(true);
    return true;
  }

  isInList(email) {
    return this.state.items.includes(email);
  }

  isInSharedList(email) {
    var dataObjU = this.props.existingMembersUnregistered;
    var dataObjR = this.props.existingMembers;
    const foundU = dataObjU.some((el) => el.email === email);
    const foundR = dataObjR.some((el) => el.email === email);
    if (foundU || foundR) return true;
  }

  isEmail(email) {
    return validator.isEmail(email);
  }

  render() {
    let emailList = this.state.items;

    return (
      <div className="extInviteBlock">
        {this.state.items.map((item) => (
          <div className="tag-item" key={item}>
            {item}
            <button
              type="button"
              className="button"
              onClick={() => this.handleDelete(item)}
            >
              &times;
            </button>
          </div>
        ))}

        <input
          className={'input ' + (this.state.error && ' has-error')}
          value={this.state.value}
          placeholder="Enter email address"
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          onPaste={this.handlePaste}
        />

        {this.state.error && <p className="error">{this.state.error}</p>}

        <div>
          <span className="listblock">eMails List: </span>
          {emailList.join(', ') || ''}
        </div>
      </div>
    );
  }
}

NonRegisteredUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMemberExtIdToFormProp: (arr) => dispatch(updateMemberExtIdsForm(arr)),
  };
};

const mapStateToProps = (state) => {
  return {
    playlistData: state.search.userSearch,
    existingMembers: state.playlist.PlaylistByIdData.members,
    existingMembersUnregistered:
      state.playlist.PlaylistByIdData.membersunregistered,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NonRegisteredUser);
