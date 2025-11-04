import { RESET_USER_META, SET_TRANSACTION_TOKEN, SET_USER_META } from "../../constants/actionTypes";

export const setUserMeta = (userMeta) => {
  return {
    type: SET_USER_META,
    payload: userMeta,
  };
};

export const setTransactionToken = (ttoken) => {
  console.log('ttoken', ttoken)
  return {
    type: SET_TRANSACTION_TOKEN,
    payload: ttoken,
  };
};

export const resetUserMeta = () => {
  return {
    type: RESET_USER_META,
  };
};
