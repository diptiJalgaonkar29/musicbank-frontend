import {
  useClearRefinements,
  useCurrentRefinements,
  useRange,
} from "react-instantsearch";
// import getAmpMoodTagLabel from "../../common/utils/getAmpMoodTagLabel";
// import getInstrumentsLabel from "../../common/utils/getInstrumentsLabel";
import getAssetTypeLabel from "../../common/utils/getAssetTypeLabel";
import { ReactComponent as CloseRed } from "../../static/CloseRed.svg";
import { ReactComponent as CloseIcon } from "../../static/closeIcon.svg";
import getBrandLabel from "../../common/utils/getBrandLabel";

const FilterChips = () => {
  const { items } = useCurrentRefinements();
  const { refine: clearAll } = useClearRefinements();
  const { start, range, canRefine, refine } = useRange({
    attribute: "bpm",
  });

  // console.log("start99", start);
  // console.log("range99", range);

  // 🔍 Filter out hidden filters (like `track_type_id`)
  const visibleItems = items.filter(
    (group) =>
      group.attribute !== "track_type_id" && group.attribute !== "track_name"
  );

  if (visibleItems.length === 0) return null;

  const isRangeAttribute = (attribute) => attribute === "bpm";

  const getDisplayLabel = (attribute, label) => {
    switch (attribute) {
      case "brands_assigned":
        return getBrandLabel(label);
      // case "instrument_ids":
      //   return getInstrumentsLabel(label);
      case "asset_type_id":
        return getAssetTypeLabel(label);
      default:
        return label;
    }
  };

  return (
    <div className="filter-chips-wrapper">
      {/* ✅ Show Clear All only if there are visible (non-hidden) filters */}
      {visibleItems.length > 0 && (
        <span className="ClearFilterBtn" onClick={clearAll}>
          Clear All Filters <CloseRed className="closeRedIcon" />
        </span>
      )}

      <div className="algolia-chip-container">
        {visibleItems.map((group, i) => {
          console.log("group", group);
          const { attribute, refinements, refine, label } = group;

          if (isRangeAttribute(attribute)) {
            const DEFAULT_MIN = range?.min;
            const DEFAULT_MAX = range?.max;

            let minVal = null;
            let maxVal = null;

            refinements.forEach((ref) => {
              if (Array.isArray(ref.value)) {
                minVal = ref.value[0] ?? minVal;
                maxVal = ref.value[1] ?? maxVal;
              } else if (ref.label.startsWith("≥")) {
                minVal = parseFloat(ref.label.replace("≥", "").trim());
              } else if (ref.label.startsWith("≤")) {
                maxVal = parseFloat(ref.label.replace("≤", "").trim());
              }
            });

            const displayMin = minVal ?? DEFAULT_MIN;
            const displayMax = maxVal ?? DEFAULT_MAX;

            return (
              <div key={`range-${i}`} className="algolia-chip">
                {`${label}: ${displayMin}–${displayMax}`}
                <span
                  className="chip-close"
                  onClick={() => refinements.forEach((r) => refine(r))}
                  title="Remove BPM filter"
                >
                  <CloseIcon height={12} width={12} />
                </span>
              </div>
            );
          }

          return refinements.map((ref, j) => (
            <div key={`${i}-${j}`} className="algolia-chip">
              {getDisplayLabel(attribute, ref.label)}
              <span
                className="chip-close"
                onClick={() => refine(ref)}
                title="Remove filter"
              >
                <CloseIcon height={12} width={12} />
              </span>
            </div>
          ));
        })}
      </div>
    </div>
  );
};

export default FilterChips;
