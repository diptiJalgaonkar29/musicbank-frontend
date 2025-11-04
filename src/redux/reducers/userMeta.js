import {
  RESET_USER_META,
  SET_TRANSACTION_TOKEN,
  SET_USER_META,
} from "../../redux/constants/actionTypes";

const userMetaInit = {
  brandName: "",
  brandId: "",
  isPersonalizedTrackingAllowed: "",
  isSSOLogin: "",
  ssAccess: false,
  isCSUser: false,
  email: "",
  userId: "",
  transactionToken: null,
};

const AuthenticationReducer = (state = userMetaInit, action) => {
  switch (action.type) {
    case SET_USER_META:
      return {
        ...state,
        ...action.payload,
      };
    case SET_TRANSACTION_TOKEN:
      return {
        ...state,
        transactionToken: action.payload,
      };
    case RESET_USER_META:
      return userMetaInit;
    default:
      return state;
  }
};

export default AuthenticationReducer;
