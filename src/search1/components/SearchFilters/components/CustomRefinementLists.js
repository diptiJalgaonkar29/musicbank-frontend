import React, { useState } from "react";
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
          style={{ padding: "0 2rem 0 70px", margin: "0.4rem 0" }}
        >
          <FormattedMessage id="results.page.noResults" />
        </p>
      </div>
    );
  }
  const INIT_TAGS_TO_SHOW = 6;
  const [showCount, setShowCount] = useState(INIT_TAGS_TO_SHOW);

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

  return (
    <>
      {itemsSorted.slice(0, showCount).map((item, index) => {
        return (
          <li
            key={"tag" + index}
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
                {`  (${item.count})`}
                {/* <span className="accordion__body__nested--subtext">{`  (${item.count})`}</span> */}
              </p>
              {!item.isRefined ? <AddIcon /> : <RemoveIcon />}
            </div>
          </li>
        );
      })}

      {itemsSorted.length > INIT_TAGS_TO_SHOW && (
        <li
          key="showMore"
          onClick={(e) => {
            e.preventDefault();
            showCount === INIT_TAGS_TO_SHOW
              ? setShowCount(itemsSorted.length)
              : setShowCount(INIT_TAGS_TO_SHOW);
          }}
        >
          <div
            className={"accordion__body__nested--li"}
            style={{ color: "var(--color-primary)" }}
          >
            {showCount === INIT_TAGS_TO_SHOW ? (
              <p className="accordion__body__nested--maintext">
                Show More &#8595;
              </p>
            ) : (
              <p className="accordion__body__nested--maintext">
                Show Less &#8593;
              </p>
            )}
          </div>
        </li>
      )}
    </>
  );
});

export default CustomRefinementList;
