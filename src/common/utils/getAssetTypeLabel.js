import { store } from "../../redux/stores/store";

const getAssetTypeLabel = (tag) => {
  const { taxonomy } = store.getState();
  return taxonomy?.assetTypeIdAndLabelObj[tag] || tag;
};
export default getAssetTypeLabel;
