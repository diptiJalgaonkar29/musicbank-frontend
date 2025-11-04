import {
  SET_JOBHISTORY_IDS,
  SET_JOBHISTORY_PROCCESSED_DATA,
  REMOVE_ALL_JOBHISTORY_PROCCESSED_DATA,
  SET_IS_GET_JOBHISTORY_STATUS_LOOPED,
  SET_TTS_VOICES,
} from '../../constants/actionTypes';

export const setJobHistoryData = (data) => {
  return {
    type: SET_JOBHISTORY_IDS,
    payload: data,
  };
};

export const setJobHistoryProccessedData = (data) => {
  return {
    type: SET_JOBHISTORY_PROCCESSED_DATA,
    payload: data,
  };
};

export const removeAllJobHistoryProccessedData = () => {
  return {
    type: REMOVE_ALL_JOBHISTORY_PROCCESSED_DATA,
  };
};

export const setIsgetJobHistoryStatusLooped = (isLooped) => {
  return {
    type: SET_IS_GET_JOBHISTORY_STATUS_LOOPED,
    payload: isLooped,
  };
};

export const setTTSVoices = (voices) => {
  return {
    type: SET_TTS_VOICES,
    payload: voices,
  };
};
