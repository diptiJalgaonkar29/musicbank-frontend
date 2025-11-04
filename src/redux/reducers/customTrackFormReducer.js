import { id } from "date-fns/locale";
import {
  RESET_CUSTOM_TRACK_FORM,
  SET_CUSTOM_TRACK_FORM,
} from "../constants/actionTypes";

const init = {
  customTrackForm: {
    id: "",
    projectTitle: "",
    focusOfContent: "",
    mediaFormat: "",
    mediaFile: "",
    audioType: "",
    audioDeliverables: "",
    deadline: "",
    creativeBrief: "no",
  },
  creativeBriefing: {
    mediaFile: "",
    keywords: "",
  },
  musicInspiration: {
    tracks: [],
  },
  musicStyle: {
    audioType: "",
    tonality: [],
    genre: [],
  },
  visualReferences: {
    mediaFile: [],
  },
};

const customTrackFormReducer = (state = init, action) => {
  switch (action.type) {
    case SET_CUSTOM_TRACK_FORM:
      // console.log("action.payload.key", action.payload.key);
      // console.log("action.payload.value", action.payload.values);
      return {
        ...state,
        [action.payload.key]: action.payload.values,
      };

    case RESET_CUSTOM_TRACK_FORM:
      return init;
    default:
      return state;
  }
};

export default customTrackFormReducer;
