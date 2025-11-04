import {RESET_PASSWORD_FAILURE, RESET_PASSWORD_SUCCESS} from '../actions/AuthenticationActionTypes';

const initialState = {
  result: undefined,
  error: null
};

const RecoverPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
  case RESET_PASSWORD_SUCCESS:
    return {
      result: true,
      error: null,
    };
  case RESET_PASSWORD_FAILURE:
    return {
      error: action.error
    };
  default:
    return state;
  }
};

export default RecoverPasswordReducer;