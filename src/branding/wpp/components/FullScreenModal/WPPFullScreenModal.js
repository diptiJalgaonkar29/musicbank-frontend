import React, { useEffect, useRef, useState } from "react";
import { WppFullScreenModal, WppButton } from "@wppopen/components-library-react";
import "../../theme/shadow-part.css";

const WPPFullScreenModal = ({
  isOpen,
  setIsOpen,
  onClose,
  title,
  className = "",
  children,
  withTitle,
  props
}) => {
  const modalRef = useRef(null);
  console.log("fullscreenmodel ", props)

  useEffect(() => {
    const modalEl = modalRef.current;

    if (!modalEl) return;

    const handleClose = (e) => {
      console.log("in WPPFullscreenmodal close  ---")
      setIsOpen(false);
      props.onClose();
    };

    // listen for backdrop / ESC close event
    modalEl.addEventListener("wppModalClose", handleClose);

    return () => {
      //modalEl.removeEventListener("wppModalClose", handleClose);
    };
  }, [setIsOpen, onClose]);

  const [isFullScreenModalOpen, setFullScreenModalOpen] = useState(isOpen)

  const handleOpenModal = () => { setFullScreenModalOpen(true) }
  const handleCloseModal = () => { onClose(); setFullScreenModalOpen(false) }

  return (
    <WppFullScreenModal withTitle={false} open={isFullScreenModalOpen} onWppFullScreenModalClose={handleCloseModal} className={`wppModal ${className}`}>

      <div slot="body"
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          height: "95%",
        }}>
        {children}
      </div>
      {/* <div slot="actions">
        <WppButton variant="primary" size="s" onClick={handleCloseModal}>Close</WppButton>
      </div> */}
    </WppFullScreenModal>
  )

  /* return (
    <WppFullScreenModal ref={modalRef} open={isOpen} className={`wppModal ${className}`}>
      <div
        slot="body"
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: "80vh",
          padding: "15px 20px",
        }}
      >        
        {children}
      </div>
    </WppFullScreenModal>
  ); */
};

export default WPPFullScreenModal;
