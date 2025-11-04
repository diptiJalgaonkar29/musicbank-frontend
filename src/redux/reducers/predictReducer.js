import { CLEAR_PREDICT, SET_PREDICT } from '../constants/actionTypes';

const initialState = {
    data: null,
};

export default function predictReducer(state = initialState, action) {
    switch (action.type) {
        case SET_PREDICT:
            return { ...state, data: action.payload };
        case CLEAR_PREDICT:
            return { ...state, data: null };
        default:
            return state;
    }
}