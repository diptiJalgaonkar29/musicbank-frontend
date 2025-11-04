import React from "react";
import Dialog from "@mui/material/Dialog";
import "./SonicModal.css";
import { ReactComponent as CloseIcon } from "../../../../static/closeIcon.svg";

export default function SonicModal({
  isOpen,
  onClose = () => {},
  title,
  className = "",
  children,
  disableCloseIcon = false,
  disableBackdropClick=false
}) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="SonicModal_dialog-title"
      open={isOpen}
      // disableBackdropClick={disableBackdropClick}
      className={`SonicModal_dialog ${className}`}
    >
      <div>
        {!disableCloseIcon && (
          <button
            className="SonicModal_dialog-close SonicModal_close_icon"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        )}

        <div slot="body">
          <h3 slot="header" className="SonicModal_title boldFamily">
            {title}
          </h3>
          {children}
        </div>
      </div>
    </Dialog>
  );
}
