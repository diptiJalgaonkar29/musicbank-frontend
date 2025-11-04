import { store } from "../../redux/stores/store";
import { brandConstants } from "./brandConstants";
import getSuperBrandName from "./getSuperBrandName";

export const getUserAuthMeta = () => {
  const { authentication } = store.getState();
  const userMeta =
    authentication?.userAuthorization ||
    authentication?.userAuthorization?.result;
  return userMeta;
};

export const isAuthenticated = () => {
  const { authentication } = store.getState();
  console.log("isAuthenticated::authentication", authentication);
  // console.log(
  //   (!!authentication?.userAuthorization?.result?.token &&
  //     !authentication?.userAuthorization?.result?.isExpired?.()) ||
  //     (!!authentication?.userAuthorization?.token &&
  //       !authentication?.userAuthorization?.isExpired?.())
  // );
  // if (getSuperBrandName() === brandConstants.WPP) {
  //   return !!authentication?.userAuthorization?.token;
  // } else {
  return (
    (!!authentication?.userAuthorization?.result?.token &&
      !authentication?.userAuthorization?.result?.isExpired?.()) ||
    (!!authentication?.userAuthorization?.token &&
      !authentication?.userAuthorization?.isExpired?.()) ||
    (getSuperBrandName() === brandConstants.WPP &&
      !!authentication?.userAuthorization?.token)
  );
  //}
};

export const getUserId = () => {
  const { authentication } = store.getState();
  return (
    authentication?.userAuthorization?.result?.userId ||
    authentication?.userAuthorization?.userId
  );
};

export const getUserMeta = () => {
  const { userMeta } = store.getState();
  return userMeta;
};
