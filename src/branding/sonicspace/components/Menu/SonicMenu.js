import { Menu } from "@mui/material";
import React from "react";
import "./SonicMenu.css";

const SonicMenu = ({
  open,
  onClose,
  onOpening,
  className = "",
  children,
  ...props
}) => {
  return (
    <Menu
      open={open}
      onClose={onClose}
      onEntering={onOpening}
      {...props}
      className={`sonic_menu_container ${className}`}
    >
      {children}
    </Menu>
  );
};

export default SonicMenu;
