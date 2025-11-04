import {
  OPEN_SEARCH_MEMBER_DIALOG,
  CLOSE_SEARCH_MEMBER_DIALOG,
  OPEN_SEARCH_MEMBER_EXTERNAL_DIALOG,
  CLOSE_SEARCH_MEMBER_EXTERNAL_DIALOG,
  UPDATE_MEMBER_IDS_FORM,
  CLEAR_MEMBER_IDS_FROM_FORM,
  UPDATE_MEMBER_EXT_IDS_FORM,
  UPDATE_MEMBER_COMBINE_IDS_FORM,
  OPEN_MEMBER_OVERVIEW_DIALOG,
  CLOSE_MEMBER_OVERVIEW_DIALOG,
  OPEN_MEMBER_OVERVIEW_GUEST_DIALOG,
  CLOSE_MEMBER_OVERVIEW_GUEST_DIALOG,
} from "../../constants/actionTypes.js";

//addition by Trupti-Wits

export const openAddMemberToPlaylistDialog = () => {
  return {
    type: OPEN_SEARCH_MEMBER_DIALOG,
  };
};
export const closeAddMemberToPlaylistDialog = () => {
  return {
    type: CLOSE_SEARCH_MEMBER_DIALOG,
  };
};

export const openAddMemberExternalToPlaylistDialog = () => {
  return {
    type: OPEN_SEARCH_MEMBER_EXTERNAL_DIALOG,
  };
};

export const closeAddMemberExternalToPlaylistDialog = () => {
  return {
    type: CLOSE_SEARCH_MEMBER_EXTERNAL_DIALOG,
  };
};
export const updateMemberIdsForm = (arr) => {
  return {
    type: UPDATE_MEMBER_IDS_FORM,
    arr,
  };
};
export const clearMemberIdsForm = () => {
  return {
    type: CLEAR_MEMBER_IDS_FROM_FORM,
  };
};

export const updateMemberExtIdsForm = (arr) => {
  return {
    type: UPDATE_MEMBER_EXT_IDS_FORM,
    arr,
  };
};

export const updateMemberCombineIdsForm = (arr) => {
  // console.log(arr, 'updateMemberCombineIdsForm ');
  return {
    type: UPDATE_MEMBER_COMBINE_IDS_FORM,
    arr,
  };
};

export const openMemberOverview = (arr) => {
  return {
    type: OPEN_MEMBER_OVERVIEW_DIALOG,
    arr,
  };
};
export const closeMemberOverview = () => {
  return {
    type: CLOSE_MEMBER_OVERVIEW_DIALOG,
  };
};

export const openMemberOverviewGuest = (arr) => {
  return {
    type: OPEN_MEMBER_OVERVIEW_GUEST_DIALOG,
    arr,
  };
};
export const closeMemberOverviewGuest = () => {
  return {
    type: CLOSE_MEMBER_OVERVIEW_GUEST_DIALOG,
  };
};
