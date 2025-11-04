import React, { useRef } from "react";
import "./SonicSearchBar.css";
import search from "../../../../static/search.svg";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";
import { useLocation } from 'react-router-dom';

const SonicSearchBar = ({ onChange, value }) => {
  const searchContainer = useRef();
  let location = useLocation()

  const changeBorderColor = (color) => {
    searchContainer.current.style.border = `1px solid ${color}`;
  };

  return (
    <div className="sonic_search_container" ref={searchContainer}>
      <input
        placeholder={`Search by ${location?.pathname == "/playlist/" ? "playlist" : "project"} name or keyword`}
        className="sonic_search"
        onChange={onChange}
        type="search"
        value={value}
        onFocus={() => changeBorderColor("var(--color-primary)")}
        onBlur={() => changeBorderColor("var(--color-white)")}
      />
      <IconButtonWrapper className="search_icon" src={search} icon="Search" />
    </div>
  );
};

export default SonicSearchBar;
