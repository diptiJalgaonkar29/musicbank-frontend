import { id } from "date-fns/locale";
import {
  RESET_MUSIC_LICENSING_FORM,
  SET_MUSIC_LICENSING_FORM,
} from "../constants/actionTypes";

const init = {
  projectInformation: {
    id: "",
    companyName: "",
    projectName: "",
    projectPurpose: "",
    projectAssetList: "",
  },
  trackDetails: {
    requestTrack: "",
    alternativesOption: "",
    briefingAvailableOption: "",
    mediaFile: [],
  },
  contextAndUsage: {
    licenseTypeOptions: "",
    contextMusicOption: "",
    mediaPlanAvai: "",
    airingRegionOption: [],
    mediaTypeOption: [],
    usageDuration: [],
    mediaFile: [],
    startDate: "",
    endDate: "",
  },
  budgetAndTimeline: {
    budget: "",
    startDate: "",
    endDate: "",
    mediaPlanAvai: "",
  },
  contactInformation: {
    contactName: "",
    agencyName: "",
    emailAddress: "",
    phoneNumber: "",
    location: "",
  },
};

const musicLicensingFormReducer = (state = init, action) => {
  switch (action.type) {
    case SET_MUSIC_LICENSING_FORM:
      // console.log("action.payload.key", action.payload.key);
      // console.log("action.payload.value", action.payload.values);
      return {
        ...state,
        [action.payload.key]: action.payload.values,
      };

    case RESET_MUSIC_LICENSING_FORM:
      return init;
    default:
      return state;
  }
};

export default musicLicensingFormReducer;
