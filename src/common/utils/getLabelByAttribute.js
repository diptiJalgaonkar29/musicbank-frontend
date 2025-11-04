import getAmpMainMoodTagLabel from "./getAmpMainMoodTagLabel";
import getAmpMoodTagLabel from "./getAmpMoodTagLabel";
import getAssetTypeLabel from "./getAssetTypeLabel";
import getInstrumentsLabel from "./getInstrumentsLabel";
import getSonicLogoMainMoodTagLabel from "./getSonicLogoMainMoodTagLabel";

const getLabelByAttribute = (attribute, label) => {
  switch (attribute) {
    case "tag_amp_allmood_ids":
      return getAmpMoodTagLabel(label);
    case "assetTypeId":
      return getAssetTypeLabel(label);
    case "tag_amp_mainmood_ids":
      return getAmpMainMoodTagLabel(label);
    case "tag_soniclogo_mainmood_ids":
      return getSonicLogoMainMoodTagLabel(label);
    case "instrument_ids":
      return getInstrumentsLabel(label);
    default:
      return "";
  }
};
export default getLabelByAttribute;
