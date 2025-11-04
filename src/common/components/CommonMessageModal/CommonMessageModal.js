import React from "react";
import "./CommonMessageModal.css";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpenCommonMessageModal } from "../../../redux/actions/commonMessageModal";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";

const CommonMessageModal = () => {
  const { commonMessage, isOpenCommonMessageModal } = useSelector(
    (state) => state.commonMessageModalMeta
  );
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(setIsOpenCommonMessageModal(false));
  };

  return (
    <ModalWrapper
      isOpen={isOpenCommonMessageModal}
      onClose={onClose}
      title={commonMessage?.title || ""}
      className="CommonMessageModal_screen"
      disableCloseIcon
    >
      <p className="CommonMessageModal_text">{commonMessage?.body || ""}</p>
      <ButtonWrapper onClick={onClose}>Close</ButtonWrapper>
    </ModalWrapper>
  );
};

export default CommonMessageModal;
