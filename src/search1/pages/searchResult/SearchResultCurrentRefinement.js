import React from "react";
import { connectCurrentRefinements } from "react-instantsearch-dom";
import getLabelByAttribute from "../../../common/utils/getLabelByAttribute";
import ChipWrapper from "../../../branding/componentWrapper/ChipWrapper";

const removeDuplicatesByNameArray = (array, keyToBeRemoved) => {
  const uniqueMap = {};
  return array.reduce((acc, item) => {
    const key = JSON.stringify(item?.[keyToBeRemoved]);
    if (!uniqueMap[key]) {
      uniqueMap[key] = true;
      acc.push(item);
    }
    return acc;
  }, []);
};

const CurrentRefinements = ({ items, refine, createURL }) => (
  <div className="ais-CurrentRefinements">
    <ul className="ais-CurrentRefinements-list">
      {removeDuplicatesByNameArray(items, "currentRefinement").map((item) => {
        // let itemTagLbl = item.label.replace(": ", "").replace("tag_", "tag-");
        return (
          <>
            {item.items ? (
              <>
                {item.items.map((nested) => (
                  <li
                    key={nested.value}
                    className="ais-CurrentRefinements-item"
                  >
                    <ChipWrapper
                      label={
                        getLabelByAttribute(item?.attribute, nested.label) ||
                        nested.label
                      }
                      className={`${item?.attribute}`}
                      onClose={() => {
                        refine(nested.value);
                      }}
                    />
                  </li>
                  // <li
                  //   key={nested.label}
                  //   className="ais-CurrentRefinements-item"
                  // >
                  //   <span className="ais-CurrentRefinements-label">
                  //     {item.label}
                  //   </span>
                  //   <span
                  //     className={`ais-CurrentRefinements-category ${item?.attribute}`}
                  //     style={{
                  //       backgroundColor: `var(--color-bubble${itemTagLbl}-bg)`,
                  //       color: `var(--color-bubble${itemTagLbl}-text)`,
                  //     }}
                  //   >
                  //     <span className="ais-CurrentRefinements-categoryLabel">
                  //       {getLabelByAttribute(item?.attribute, nested.label) ||
                  //         nested.label}
                  //     </span>
                  //     <button
                  //       className="ais-CurrentRefinements-delete"
                  //       onClick={(event) => {
                  //         event.preventDefault();
                  //         refine(nested.value);
                  //       }}
                  //     >
                  //       ✕
                  //     </button>
                  //   </span>
                  // </li>
                ))}
              </>
            ) : (
              <li key={item.label} className="ais-CurrentRefinements-item">
                <a
                  href={createURL(item.value)}
                  onClick={(event) => {
                    event.preventDefault();
                    refine(item.value);
                  }}
                >
                  {item.label}
                </a>
              </li>
            )}
          </>
        );
      })}
    </ul>
  </div>
);

export const SearchResultCurrentRefinement =
  connectCurrentRefinements(CurrentRefinements);
