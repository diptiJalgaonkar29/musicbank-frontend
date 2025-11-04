import { store } from "../../redux/stores/store";

const getSonicLogoMainMoodTagLabel = (tag) => {
  const { taxonomy } = store.getState();
  return (
    taxonomy?.sonicLogoMainMoodTagsIdAndLabelObj[tag?.split("-")?.[1]] || tag
  );
};
export default getSonicLogoMainMoodTagLabel;
