import { store } from "../../redux/stores/store";

const getAmpMoodTagLabel = (tag) => {
  const { taxonomy } = store.getState();
  return taxonomy?.ampMoodTagsIdAndLabelObj[tag?.split("-")?.[1]] || tag;
};
export default getAmpMoodTagLabel;
