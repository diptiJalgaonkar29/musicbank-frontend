import React, { useMemo } from "react";
import BubbleTagCloud from "./BubbleTagCloud5"; //d3v7
//import BubbleTagCloud from "./BubbleTagCloud5Test1"; //d3v3
import { Scrollbar } from "react-scrollbars-custom";
import { differenceBy } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { setSuperSearchTrackFilters } from "../../redux/actions/trackFilterActions/trackFilterActions";
import toggleTag from "../../common/utils/toggleTag";

var v;
var stageW, stageH;

const SSCustomRefinementBubbles11DB = ({
  allTags,
  attribute,
  filteredTags,
}) => {
  const dispatch = useDispatch();
  const { superSearchTrackFilters: trackFilters } = useSelector(
    (state) => state.trackFilters
  );
  const tagName = attribute?.replace("tag_", "");

  var tagSetArrN = [];

  let ssFilterItems = useMemo(() => {
    // console.log("filteredTags", filteredTags);
    let newSSFilterItems = allTags?.map((x) => {
      return {
        label: x.name,
        value: x.tag_name,
        count: x.tag_tempo_count || x.count,
        isRefined: filteredTags?.findIndex((a) => a.label === x.name) >= 0,
        isActive: true,
      };
    });
    // console.log("newSSFilterItems", newSSFilterItems);
    return newSSFilterItems;
  }, [allTags]);

  if (ssFilterItems?.length > 0) {
    try {
      stageW =
        document.getElementsByClassName("gsearchBubbleDiv")?.[0]?.clientWidth;
    } catch (error) {
      stageW = visualViewport?.width;
    }
    stageH = visualViewport?.height;

    Object.keys(ssFilterItems).forEach((el) => {
      ssFilterItems[el].isActive = true;
    });

    const myDifferences = differenceBy(tagSetArrN, ssFilterItems, "label");
    try {
      tagSetArrN = [...ssFilterItems, ...myDifferences];
    } catch (error) {
      console.log("error", error);
      tagSetArrN = [];
    }
  }

  return (
    <div className="ssBubbleHolder" id={`ssBubbleHolder_${attribute}`}>
      <Scrollbar
        trackXVisible
        className="bubbleScroll"
        style={{ width: stageW, height: 500 }}
      >
        <BubbleTagCloud
          allTagsData={tagSetArrN?.map((data) => ({
            ...data,
            displayLabel: data?.label,
          }))}
          data={ssFilterItems?.map((data) => ({
            ...data,
            displayLabel: data?.label,
          }))}
          height={500}
          width={stageW}
          tagName={tagName}
          onBubbleClick={(dataItem) => {
            let item = { label: dataItem?.label, value: dataItem?.value };
            let filterItemsFinal = toggleTag(trackFilters, attribute, item);
            dispatch(setSuperSearchTrackFilters(filterItemsFinal));
          }}
        />
      </Scrollbar>
    </div>
  );
};

export default SSCustomRefinementBubbles11DB;
