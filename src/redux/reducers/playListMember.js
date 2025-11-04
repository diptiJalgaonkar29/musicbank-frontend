import {
  OPEN_SEARCH_MEMBER_DIALOG,
  CLOSE_SEARCH_MEMBER_DIALOG,
  OPEN_SEARCH_MEMBER_EXTERNAL_DIALOG,
  CLOSE_SEARCH_MEMBER_EXTERNAL_DIALOG,
  UPDATE_MEMBER_IDS_FORM,
  UPDATE_MEMBER_EXT_IDS_FORM,
  UPDATE_MEMBER_COMBINE_IDS_FORM,
  CLEAR_MEMBER_IDS_FROM_FORM,
  OPEN_MEMBER_OVERVIEW_DIALOG,
  CLOSE_MEMBER_OVERVIEW_DIALOG,
  OPEN_MEMBER_OVERVIEW_GUEST_DIALOG,
  CLOSE_MEMBER_OVERVIEW_GUEST_DIALOG,
} from '../constants/actionTypes';
import { updateObject } from '../../common/utils/utility';

//addition by Trupti-Wits

const initialState = {
  addMemberDialogOpen: false,
  addMemberExternalDialogOpen: false,
  memberOverviewDialogOpen: false,
  memberOverviewDialogGuestOpen: false,
  formMemberID: [],
};

const openAddMemberDialog = (state) => {
  return updateObject(state, {
    addMemberDialogOpen: true,
  });
};
const closeAddMemberDialog = (state) => {
  return updateObject(state, {
    addMemberDialogOpen: false,
  });
};

const openAddMemberExternalDialog = (state) => {
  return updateObject(state, {
    addMemberExternalDialogOpen: true,
  });
};
const closeAddMemberExternalDialog = (state) => {
  return updateObject(state, {
    addMemberExternalDialogOpen: false,
  });
};
const updateMemberIds = (state, action) => {
  return updateObject(state, {
    formMemberID: action.arr,
  });
};

const updateMemberExtIds = (state, action) => {
  return updateObject(state, {
    formMemberID: action.arr,
  });
};

const updateMemberCombineIds = (state, action) => {
  return updateObject(state, {
    formMemberID: action.arr,
  });
};

const clearMemberIds = (state) => {
  return updateObject(state, {
    formMemberID: [],
  });
};
const openMemberOverview = (state) => {
  return updateObject(state, {
    memberOverviewDialogOpen: true,
  });
};
const closeMemberOverview = (state) => {
  return updateObject(state, {
    memberOverviewDialogOpen: false,
  });
};

const openMemberOverviewGuest = (state) => {
  return updateObject(state, {
    memberOverviewDialogGuestOpen: true,
  });
};
const closeMemberOverviewGuest = (state) => {
  return updateObject(state, {
    memberOverviewDialogGuestOpen: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case OPEN_SEARCH_MEMBER_DIALOG:
    return openAddMemberDialog(state, action);
  case CLOSE_SEARCH_MEMBER_DIALOG:
    return closeAddMemberDialog(state, action);
  case OPEN_SEARCH_MEMBER_EXTERNAL_DIALOG:
    return openAddMemberExternalDialog(state, action);
  case CLOSE_SEARCH_MEMBER_EXTERNAL_DIALOG:
    return closeAddMemberExternalDialog(state, action);
  case UPDATE_MEMBER_IDS_FORM:
    return updateMemberIds(state, action);
  case UPDATE_MEMBER_EXT_IDS_FORM:
    return updateMemberExtIds(state, action);
  case UPDATE_MEMBER_COMBINE_IDS_FORM:
    return updateMemberCombineIds(state, action);
  case CLEAR_MEMBER_IDS_FROM_FORM:
    return clearMemberIds(state, action);
  case OPEN_MEMBER_OVERVIEW_DIALOG:
    return openMemberOverview(state, action);
  case CLOSE_MEMBER_OVERVIEW_DIALOG:
    return closeMemberOverview(state, action);
  case OPEN_MEMBER_OVERVIEW_GUEST_DIALOG:
    return openMemberOverviewGuest(state, action);
  case CLOSE_MEMBER_OVERVIEW_GUEST_DIALOG:
    return closeMemberOverviewGuest(state, action);

  default:
    return state;
  }
};

export default reducer;
