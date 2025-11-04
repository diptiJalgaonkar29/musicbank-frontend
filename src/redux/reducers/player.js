import {
  SET_IS_PLAYING_INDEX,
  SET_IS_FOOTER_MUSIC_PLAYER_PLAYING,
} from '../constants/actionTypes';

const initialState = {
  playingIndex: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_IS_PLAYING_INDEX: {
      const { index } = action;
      return {
        ...state,
        playingIndex: index,
      };
    }

    default:
      return state;
  }
}

export function isFooterMusicPlayerPlaying(state = false, action) {
  switch (action.type) {
    case SET_IS_FOOTER_MUSIC_PLAYER_PLAYING: {
      const { isPlaying } = action;
      return isPlaying;
    }

    default:
      return state;
  }
}
