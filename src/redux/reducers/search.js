import { updateObject } from "../../common/utils/utility";
import {
  CLEAR_SEARCH_ATTRIBUTES,
  SEARCH_FOR_USER,
  SET_DROPDOWN_STATE,
  SET_REFINEMENT_ITEMS,
  SET_RESULTS_FOR,
  SET_SEARCH_RESULT,
  SET_SEARCH_STATE,
  SET_SEARCH_URL,
  REMOVE_FAV_TRACK_ID,
  SET_FAV_TRACK_ID,
  SET_ALL_FAV_TRACK_IDS,
  SET_SIMIL_QUERY,
  SET_CYANITE_IDSMGT,
} from "../constants/actionTypes";

const initialState = {
  search_result: "",
  search_url: "",
  results_for: "",
  isOpen: false,
  refinement_items: null,
  search_state: {}, //HAS TO BE AN OBJECT SO <INSTANTSEARCH /> WILL AUTOMATICLY SWITCH INTO CONTROLLED MODE !
  userSearch: [{ fullname: "init", email: "init", id: 0 }],
  favTrackIds: [1],
  similQuery: "1",
  cyaniteIdsMGT: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_RESULT: {
      const { result } = action;
      return {
        ...state,
        search_result: result,
      };
    }

    case SET_REFINEMENT_ITEMS: {
      const { refinement_item } = action;
      //console.log("SET_REFINEMENT_ITEMS "+refinement_item)

      return {
        ...state,
        refinement_items: [...refinement_item],
      };
    }

    case SET_DROPDOWN_STATE: {
      const { isOpen } = action;

      return {
        ...state,
        isOpen: isOpen,
      };
    }

    case SET_SEARCH_URL: {
      const { search_url } = action;

      return {
        ...state,
        search_url,
      };
    }

    case SET_SEARCH_STATE: {
      const { search_state } = action;
      return {
        ...state,
        search_state: search_state,
      };
    }

    case SET_RESULTS_FOR: {
      const { query } = action;

      return {
        ...state,
        results_for: query,
      };
    }
    case SET_SIMIL_QUERY: {
      return {
        ...state,
        similQuery: action.payload,
      };
    }
    case SET_CYANITE_IDSMGT: {
      return {
        ...state,
        cyaniteIdsMGT: action.payload,
      };
    }
    case CLEAR_SEARCH_ATTRIBUTES: {
      return {
        ...state,
        search_result: "",
        search_url: "",
        refinement_items: null,
        isOpen: false,
        results_for: "",
        search_state: {},
      };
    }

    case SEARCH_FOR_USER: {
      const { data } = action;
      return updateObject(state, {
        userSearch: data,
      });
    }
    default:
      return state;
  }
}

export function favTracksIds(state = [], action) {
  switch (action.type) {
    case SET_FAV_TRACK_ID: {
      const { trackId } = action;
      return [...state, trackId];
    }
    case REMOVE_FAV_TRACK_ID: {
      const { trackId } = action;
      const favIds = state?.filter((id) => id !== trackId);
      return [...favIds];
    }
    case SET_ALL_FAV_TRACK_IDS: {
      const { trackIds } = action;
      return [...state, ...trackIds];
    }
    default:
      return state;
  }
}
