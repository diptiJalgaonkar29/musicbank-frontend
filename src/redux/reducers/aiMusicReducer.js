// redux/reducer.js

import { RESET_AI_MUSIC_GENERATOR, SET_AI_MUSIC_GENERATOR } from '../constants/actionTypes';

const initialState = {
  aiMusicGenerator: null,
};

const aiMusicReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AI_MUSIC_GENERATOR:
      return {
        ...state,
        aiMusicGenerator: {...state.aiMusicGenerator,...action.payload},
      };
    case RESET_AI_MUSIC_GENERATOR:
      return {
        ...state,
        aiMusicGenerator: null,
      };
    default:
      return state;
  }
};

export default aiMusicReducer;
