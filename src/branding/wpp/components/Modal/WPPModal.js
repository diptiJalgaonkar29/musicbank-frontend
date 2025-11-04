import React, { useEffect, useRef } from "react";
import { WppModal } from "@wppopen/components-library-react";
import "../../theme/shadow-part.css";

const WPPModal = ({
  isOpen,
  setIsOpen,
  onClose = () => {},
  title,
  className = "",
  children,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const modalEl = modalRef.current;

    if (!modalEl) return;

    const handleClose = (e) => {
      setIsOpen(false);
      onClose(e);
    };

    // listen for backdrop / ESC close event
    modalEl.addEventListener("wppModalClose", handleClose);

    return () => {
      modalEl.removeEventListener("wppModalClose", handleClose);
    };
  }, [setIsOpen, onClose]);

  return (
    <WppModal ref={modalRef} open={isOpen} className={`wppModal ${className}`}>
      <div
        slot="body"
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: "80vh",
          padding: "15px 20px",
        }}
      >
        <h3
          slot="header"
          style={{
            margin: "25px auto",
            textAlign: "center",
            fontSize: "24px",
            color: "var(--color-white)",
          }}
          className="wpp_modal_header"
        >
          {title}
        </h3>
        {children}
      </div>
    </WppModal>
  );
};

export default WPPModal;
