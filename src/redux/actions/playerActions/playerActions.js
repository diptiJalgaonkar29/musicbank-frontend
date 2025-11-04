import {
  SET_IS_PLAYING_INDEX,
  SET_IS_FOOTER_MUSIC_PLAYER_PLAYING,
} from '../../constants/actionTypes';

export const setIsPlayingIndex = (index) => {
  return {
    type: SET_IS_PLAYING_INDEX,
    index: index,
  };
};

export const setIsFooterMusicPlayerPlaying = (isPlaying) => {
  return {
    type: SET_IS_FOOTER_MUSIC_PLAYER_PLAYING,
    isPlaying: isPlaying,
  };
};
