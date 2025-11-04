// ALL music - Vocal - Instrumental Filter
import React from "react";
import { connectMenu } from "react-instantsearch-dom";
import styled from "styled-components";
import Tooltip from "@mui/material/Tooltip";
import { generateUniqueID } from "../../../common/utils/generateUniqueID";

const Wrapper = styled.div`
  display: inline-grid;
  justify-content: center;
  align-content: center;
  grid-template-columns: ${(props) =>
    props.cols === 2 ? "repeat(3, 1fr);" : "1fr 1fr"};
  background-color: var(--color-bg);
  color: var(--color-white);
  cursor: pointer;
  width: 92%;
  height: 3.6rem;
  min-height: 3.6rem;
  box-sizing: border-box;
  font-size: 1.6rem;
  margin-bottom: 1.1rem;
`;

const MenuSelect = ({ items, currentRefinement, refine }) => {
  return (
    <Wrapper cols={items.length}>
      <div
        style={{ color: !currentRefinement && "#00ADEF" }}
        className={
          currentRefinement
            ? "vocal-instrumental-filter__item"
            : "vocal-instrumental-filter__item activeColor"
        }
        onClick={(event) => {
          event.preventDefault();
          refine("");
        }}
      >
        {" "}
        <Tooltip title="Show all music" placement="bottom">
          <span>All music</span>
        </Tooltip>
      </div>
      {items.map((item) => {
        return (
          <div
            className="vocal-instrumental-filter__item"
            key={generateUniqueID()}
            onClick={(event) => {
              event.preventDefault();
              refine(item.isRefined ? currentRefinement : item.value);
            }}
          >
            {item.label === "true" ? (
              <Tooltip title="Show only instrumental music" placement="bottom">
                <span
                  className={
                    !item.isRefined
                      ? "vocal-instrumental-filter__item"
                      : "vocal-instrumental-filter__item activeColor"
                  }
                >
                  {" "}
                  Instrumental
                </span>
              </Tooltip>
            ) : (
              <Tooltip
                title="Show only music containing lyrics"
                placement="bottom"
              >
                <span
                  className={
                    !item.isRefined
                      ? "vocal-instrumental-filter__item"
                      : "vocal-instrumental-filter__item activeColor"
                  }
                >
                  Vocal
                </span>
              </Tooltip>
            )}
          </div>
        );
      })}
    </Wrapper>
  );
};

export default connectMenu(MenuSelect);
