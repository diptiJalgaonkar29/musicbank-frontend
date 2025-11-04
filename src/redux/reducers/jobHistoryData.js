import {
  SET_JOBHISTORY_IDS,
  SET_JOBHISTORY_PROCCESSED_DATA,
  REMOVE_ALL_JOBHISTORY_PROCCESSED_DATA,
  SET_IS_GET_JOBHISTORY_STATUS_LOOPED,
  SET_TTS_VOICES,
} from '../constants/actionTypes';

export default function jobHistoryData(state = [], action) {
  switch (action.type) {
    case SET_JOBHISTORY_IDS: {
      const { payload } = action;
      return payload;
    }
    default:
      return state;
  }
}

export function jobHistoryProccessedData(state = [], action) {
  switch (action.type) {
    case SET_JOBHISTORY_PROCCESSED_DATA: {
      const { payload } = action;

      return [...state, payload];
    }
    case REMOVE_ALL_JOBHISTORY_PROCCESSED_DATA: {
      return [];
    }

    default:
      return state;
  }
}

export function isgetJobHistoryStatusLooped(state = false, action) {
  switch (action.type) {
    case SET_IS_GET_JOBHISTORY_STATUS_LOOPED: {
      const { payload } = action;

      return payload;
    }

    default:
      return state;
  }
}

export function getTTSVoices(state = [], action) {
  switch (action.type) {
    case SET_TTS_VOICES: {
      const { payload } = action;
      return [...payload];
      //return [...state, ...payload];
    }

    default:
      return state;
  }
}
