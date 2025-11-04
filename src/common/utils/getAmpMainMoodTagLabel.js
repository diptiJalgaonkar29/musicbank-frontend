import { store } from "../../redux/stores/store";

const getAmpMainMoodTagLabel = (tag) => {
  const { taxonomy } = store.getState();
  return taxonomy?.ampMainMoodTagsIdAndLabelObj[tag?.split("-")?.[1]] || tag;
};
export default getAmpMainMoodTagLabel;
