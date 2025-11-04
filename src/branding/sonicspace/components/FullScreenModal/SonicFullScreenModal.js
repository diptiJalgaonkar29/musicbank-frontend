import React from "react";
import Dialog from "@mui/material/Dialog";
import "./SonicFullScreenModal.css";
import { ReactComponent as CloseIcon } from "../../../../static/closeIcon.svg";



export default function SonicFullScreenModal({
  isOpen,
  setIsOpen,
  onClose,
  title,
  className = "",
  children,
  disableCloseIcon = false,
  disableBackdropClick=false
}) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="SonicFSModal_dialog-title"
      open={isOpen}
      // disableBackdropClick={disableBackdropClick}
      className={`SonicFSModal_dialog ${className}`}
      fullScreen={true}
      maxWidth="95%"
    >
      <div style={{height:"95%", margin: "50px 15px 15px 15px"}}>
        {!disableCloseIcon && (
          <button
            className="SonicFSModal_dialog-close SonicFSModal_close_icon"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        )}

        <div slot="body"
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          height: "95%",
        }}>
          {/* <h3 slot="header" className="SonicFSModal_title boldFamily">
            {title}
          </h3> */}
          {children}
        </div>
      </div>
    </Dialog>
  );
}
