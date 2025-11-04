import AsyncService from "../../networking/services/AsyncService";
import { setNotificationTopBar } from "../../redux/actions/notificationActions";
import { store } from "../../redux/stores/store";

const getPreLoginBanner = ({
  isVisible = false,
  isClosed = false,
  msg = "",
}) => {
  AsyncService.loadDataUnauthorized(
    "/banner/getBannerActiveOnCurrentDatePreLogin"
  )
    .then((res) => {
      // console.log("getPreLoginBanner res :: ", res?.data);
      store.dispatch(
        setNotificationTopBar({
          isVisible: !!res?.data?.bannerText,
          msg: res?.data?.bannerText,
          isClosed:
            isClosed &&
            !!res?.data?.bannerText &&
            res?.data?.bannerText === msg,
        })
      );
    })
    .catch((err) => console.log("err", err));
};

export default getPreLoginBanner;
