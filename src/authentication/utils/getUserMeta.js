import { store } from "../../redux/stores/store";

export const getUserMeta = () => {
  const { authentication } = store.getState();
  return authentication?.userMeta;
};
