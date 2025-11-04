import { store } from "../../redux/stores/store";

const getInstrumentsLabel = (tag) => {
  const { taxonomy } = store.getState();
  return taxonomy?.instrumentsIdAndLabelObj[tag?.split("-")?.[1]] || tag;
};
export default getInstrumentsLabel;
