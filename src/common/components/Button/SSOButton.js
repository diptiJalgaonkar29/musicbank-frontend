import React from "react";
import styled from "styled-components";
import "../../../_styles/Theming/__BUTTONS.css";

const ButtonContainer = styled.button`
  width: 100%;
  display: inline-block;
  margin-top: 0px;
  text-align: center;
  height: auto;
  border: none;
  color: var(--color-white);
  padding: 0;
  outline: none;
`;

const ButtonText = styled.a`
  width: 100%;
  cursor: pointer;
  height: 100%;
  min-height: 5.5rem;
  font-weight: 400;
  font-size: 1.9rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 25px;
  border-radius: "var(--search-input-radius)";
  &:hover {
    outline: 0;
  }
`;

export const SSOButton = (props) => {
  return (
    <ButtonContainer
      onClick={props.onClick}
      marginTop={props.marginTop}
      borderRadius={props.borderRadius}
    >
      <ButtonText
        className="button-primary"
        disabled={props.disabled}
        borderRadius={props.borderRadius}
      >
        {props.text}
      </ButtonText>
    </ButtonContainer>
  );
};
