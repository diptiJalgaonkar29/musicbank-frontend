import React, { useEffect, useMemo } from "react";
import "./CustomNotificationTopBar.css";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationTopBar } from "../../../redux/actions/notificationActions";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import getPostLoginBanner from "../../utils/getPostLoginBanner";
import getPreLoginBanner from "../../utils/getPreLoginBanner";
import { isAuthenticated } from "../../utils/getUserAuthMeta";

const CustomNotificationTopBar = ({ hideCloseBtn = false }) => {
  const notificationTopBar = useSelector((state) => state.notificationTopBar);
  const { userAuthorization } = useSelector((state) => state.authentication);

  const dispatch = useDispatch();

  const userAuthorizationMemo = useMemo(
    () => userAuthorization,
    [userAuthorization]
  );

  useEffect(() => {
    if (isAuthenticated()) {
      getPostLoginBanner(notificationTopBar);
    } else {
      getPreLoginBanner(notificationTopBar);
    }
  }, [userAuthorizationMemo]);

  const onClose = () => {
    dispatch(
      setNotificationTopBar({
        isClosed: true,
      })
    );
  };

  if (
    !notificationTopBar?.isVisible ||
    notificationTopBar?.isClosed ||
    !notificationTopBar?.msg
  ) {
    return <></>;
  } else {
    return (
      <div className="CustomNotificationTopBar_container">
        <p
          className="CustomNotificationTopBar_text"
          dangerouslySetInnerHTML={{
            __html: notificationTopBar?.msg,
          }}
        />
        {!hideCloseBtn && (
          <IconButtonWrapper
            icon="Close"
            className="CustomNotificationTopBar_close_btn"
            onClick={onClose}
          />
        )}
      </div>
    );
  }
};

export default CustomNotificationTopBar;
