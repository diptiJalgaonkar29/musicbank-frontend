import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import * as actions from "../../../redux/actions/notificationActions";

const Notifications = () => {
  const allIds = useSelector((state) => state.notifications.allIds);
  const byId = useSelector((state) => state.notifications.byId);
  const dispatch = useDispatch();

  const dismissNotification = (id) => {
    dispatch(actions.dismissNotification(id));
  };

  if (!allIds?.length) return null;

  return (
    <div>
      {allIds.map((id) => {
        const notification = byId[id];
        if (!notification) return null;

        return (
          <Snackbar
            key={id}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={notification}
            // sx={{ "& .MuiSnackbarContent-root": { maxWidth: "70%", height: "auto" } }}
          >
            <SnackbarContent
              message={notification.message}
              sx={{
                borderRadius: 0,
                color: "var(--color-white)",
                fontSize: "1.6rem",
                backgroundColor:
                  notification.type === "error"
                    ? "var(--color-error)"
                    : "var(--color-primary)",
                fontFamily: "var(--font-primary)",
              }}
              action={
                <IconButton
                  onClick={() => dismissNotification(id)}
                  sx={{ color: "var(--color-white)" }}
                  className="closeSnackbarButton"
                >
                  <CloseIcon />
                </IconButton>
              }
            />
          </Snackbar>
        );
      })}
    </div>
  );
};

export default Notifications;
