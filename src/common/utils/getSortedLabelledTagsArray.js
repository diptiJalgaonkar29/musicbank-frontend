import getAmpMainMoodTagLabel from "./getAmpMainMoodTagLabel";
import getAmpMoodTagLabel from "./getAmpMoodTagLabel";
import getInstrumentsLabel from "./getInstrumentsLabel";
import getSonicLogoMainMoodTagLabel from "./getSonicLogoMainMoodTagLabel";
import getSonicLogoMoodTagLabel from "./getSonicLogoMoodTagLabel";

const getSortedLabelledTagsArray = (tagArr, type) => {
  if (!tagArr || !Array.isArray(tagArr) || tagArr?.length === 0) return [];
  let getLabelFunction;
  switch (type) {
    case "AMP_MAIN_MOOD_TAGS":
      getLabelFunction = getAmpMainMoodTagLabel;
      break;
    case "AMP_MOOD_TAGS":
      getLabelFunction = getAmpMoodTagLabel;
      break;
    case "SONIC_LOGO_MAIN_MOOD_TAGS":
      getLabelFunction = getSonicLogoMainMoodTagLabel;
      break;
    case "SONIC_LOGO_MOOD_TAGS":
      getLabelFunction = getSonicLogoMoodTagLabel;
      break;
    case "INSTRUMENTS":
      getLabelFunction = getInstrumentsLabel;
      break;

    default:
      break;
  }
  let mappedTags = tagArr?.map((tag) => getLabelFunction(tag)).sort();
  return mappedTags;
};
export default getSortedLabelledTagsArray;
