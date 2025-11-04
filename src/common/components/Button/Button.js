import React from "react";
import styled from "styled-components";
import "../../../_styles/Theming/__BUTTONS.css";

const ButtonContainer = styled.button`
  width: ${(props) => (props.width ? props.width : "220px")};
  display: inline-block;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : "25px")};
  text-align: center;
  height: auto;
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "var(--search-input-radius)"};

  border: none;
  padding: 0;
  outline: none;
`;

const ButtonText = styled.a`
  width: 100%;
  background: ${(props) => props.disabled && "#eee !important"};
  pointer-events: ${(props) => (props.disabled ? "none" : "all")};
  color: ${(props) => (props.disabled ? "black" : "var(--color-white)")};
  cursor: pointer;
  height: 100%;
  min-height: 4.5rem;
  font-size: 1.8rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 25px;
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "var(--search-input-radius)"};

  &:hover {
    outline: 0;
  }
`;

export const Button = (props) => {
  const { variant } = props;
  const className =
    variant === "secondary" ? "button-secondary" : "button-primary";
  return (
    <ButtonContainer
      width={props.width}
      onClick={props.onClick}
      marginTop={props.marginTop}
      borderRadius={props.borderRadius}
      className={props.className}
    >
      <ButtonText
        disabled={props.disabled}
        className={className}
        borderRadius={props.borderRadius}
      >
        <span className="button_span">{props.text}</span>
      </ButtonText>
    </ButtonContainer>
  );
};
