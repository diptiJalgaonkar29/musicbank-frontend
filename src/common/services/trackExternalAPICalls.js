import AsyncService from "../../networking/services/AsyncService";
import getSuperBrandId from "../utils/getSuperBrandId";
import getClientMeta from "../utils/getClientMeta";
import { getUserMeta } from "../utils/getUserAuthMeta";

const trackExternalAPICalls = async ({
  url,
  requestData,
  usedFor,
  serviceBy,
  statusCode,
  statusMessage,
  onSuccess,
  onError,
}) => {
  const { deviceType, windowSize, os, browserVersion, browserName } =
    getClientMeta();
  const userMeta = getUserMeta();
  try {
    const data = {
      url,
      requestData,
      usedFor,
      serviceBy,
      statusCode,
      statusMessage,
      brandId: +getSuperBrandId(),
      ...(userMeta?.isPersonalizedTrackingAllowed && {
        deviceType,
        windowSize,
        os,
        browserVersion,
        browserName,
      }),
    };
    const response = await AsyncService.postData("/trackingData", data);
    // console.log("response", response);
    // if (onSuccess && typeof onSuccess === "function") {
    onSuccess?.(response);
    // }
  } catch (error) {
    console.log("error", error);
    // if (onError && typeof onError === "function") {
    onError?.(error);
    // }
  }
};

export default trackExternalAPICalls;
