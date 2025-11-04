import React from "react";
import { connectRefinementList } from "react-instantsearch-dom";
import { FormattedMessage } from "react-intl";
import { AddIcon, RemoveIcon } from "./Icons";

const CustomRefinementList = connectRefinementList(({ items, refine }) => {
  // case if there are no results
  if (items.length === 0) {
    return (
      <div>
        <p
          className="accordion__body__nested--maintext"
          style={{ padding: "0.5rem 2rem" }}
        >
          <FormattedMessage id="results.page.noResults" />
        </p>
      </div>
    );
  }
  // sort tags from a-z
  const itemsSorted = items.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });

  return itemsSorted.map((item, index) => {
    return (
      <li
        key={index}
        onClick={(e) => {
          e.preventDefault();
          refine(item.value);
        }}
      >
        <div
          className={
            item.isRefined
              ? "accordion__body__nested--li_active"
              : "accordion__body__nested--li"
          }
        >
          <p className="accordion__body__nested--maintext">
            {item.label}
            <span className="accordion__body__nested--subtext">{`  (${item.count})`}</span>
          </p>
          {!item.isRefined ? <AddIcon /> : <RemoveIcon />}
        </div>
      </li>
    );
  });
});

export default CustomRefinementList;
