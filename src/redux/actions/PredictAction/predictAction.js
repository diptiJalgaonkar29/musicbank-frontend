import { CLEAR_PREDICT, SET_PREDICT } from '../../constants/actionTypes';

export const setPredict = (data) => ({
    type: SET_PREDICT,
    payload: data,
});

export const clearPredict = () => ({
    type: CLEAR_PREDICT,
});