import { NavLink } from "react-router-dom";
import { isMobile } from "react-device-detect";

const navItem = (props) => (
  <li
    className="navitem"
    onClick={() => (props.clickFunction ? props.clickFunction() : null)}
    // onMouseEnter={() => (props.hoverFunction ? props.hoverFunction() : null)}
    // onMouseLeave={() => (props.blurFunction ? props.blurFunction() : null)}
    id={props.id || ""}
  >
    <NavLink
      to={props.link}
      end={props.exact}
      style={{ pointerEvents: props.disable ? "none" : "all" }}
      className={({ isActive }) =>
        `${props.dontActivate ? "navitem" : isActive ? "navitem--active" : ""} ${isMobile ? "MobileNavbar--anchor" : "WebNavbar--anchor"
        }`
      }
    >
      {props.children}
    </NavLink>
  </li>
);

export default navItem;
