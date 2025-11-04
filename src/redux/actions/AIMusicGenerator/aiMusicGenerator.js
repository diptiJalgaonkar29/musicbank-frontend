// redux/actions.js

import { RESET_AI_MUSIC_GENERATOR, SET_AI_MUSIC_GENERATOR } from '../../constants/actionTypes';

export const setAiMusicGenerator = (payload) => ({
  type: SET_AI_MUSIC_GENERATOR,
  payload,
});

export const resetAiMusicGenerator = () => ({
  type: RESET_AI_MUSIC_GENERATOR,
});
