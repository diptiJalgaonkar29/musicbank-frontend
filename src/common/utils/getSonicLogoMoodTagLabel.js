import { store } from "../../redux/stores/store";

const getSonicLogoMoodTagLabel = (tag) => {
  const { taxonomy } = store.getState();
  return taxonomy?.sonicLogoMoodTagsIdAndLabelObj[tag?.split("-")?.[1]] || tag;
};
export default getSonicLogoMoodTagLabel;
