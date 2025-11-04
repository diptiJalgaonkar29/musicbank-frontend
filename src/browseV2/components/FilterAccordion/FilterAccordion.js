import React, { useState } from "react";
import "./FilterAccordion.css";
import AccordionWrapper from "../../../branding/componentWrapper/AccordionWrapper";
import _, { uniqBy, some } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { setTrackFilters } from "../../../redux/actions/trackFilterActions/trackFilterActions";
import toggleTag from "../../../common/utils/toggleTag";

const FilterAccordion = ({
  label,
  attribute,
  filteredTags,
  items,
  children,
}) => {
  const dispatch = useDispatch();
  const { browseTrackFilters: trackFilters } = useSelector(
    (state) => state.trackFilters
  );
  const INIT_TAGS_TO_SHOW = 6;
  const [showCount, setShowCount] = useState(INIT_TAGS_TO_SHOW);
  const addToFilter = (item) => {
    if (attribute === "tempo") {
      dispatch(
        setTrackFilters({
          [attribute]: uniqBy([...trackFilters[attribute], item], "value"),
        })
      );
    } else {
      let filterItemsFinal = toggleTag(trackFilters, attribute, item);
      dispatch(setTrackFilters(filterItemsFinal));
    }
  };

  return (
    <AccordionWrapper title={label}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>{!!children && children}</div>
        {items?.length > 0 ? (
          <div>
            {_.sortBy(items, (o) => o.name)
              ?.slice(0, showCount)
              ?.map((item) => {
                const isValuePresent = some(filteredTags, {
                  value: item?.tag_name,
                });
                return (
                  <p
                    key={item?.name}
                    className={`FilterAccordion_item ${attribute} ${
                      isValuePresent ? "FilterAccordion_active_tag" : ""
                    }`}
                    onClick={() =>
                      addToFilter({
                        label: item?.name,
                        value: item?.tag_name || item?.name,
                      })
                    }
                  >
                    {item?.name}{" "}
                    {item?.count > 0 && <span>({item?.count})</span>}
                  </p>
                );
              })}
            {items.length > INIT_TAGS_TO_SHOW && (
              <div
                key="showMore"
                onClick={(e) => {
                  e.preventDefault();
                  showCount === INIT_TAGS_TO_SHOW
                    ? setShowCount(items.length)
                    : setShowCount(INIT_TAGS_TO_SHOW);
                }}
              >
                {showCount === INIT_TAGS_TO_SHOW ? (
                  <p className={`FilterAccordion_item`}>Show More &#8595;</p>
                ) : (
                  <p className={`FilterAccordion_item`}>Show Less &#8593;</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className={`FilterAccordion_item`}>No results</p>
        )}
      </div>
    </AccordionWrapper>
  );
};

export default FilterAccordion;
