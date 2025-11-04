import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTrackFilters } from "../../../redux/actions/trackFilterActions/trackFilterActions";
import { ReactComponent as AccArrow } from "../../../static/AccArrow.svg";
import "./FilterSidebar.css";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import { ReactComponent as Stars } from "../../../static/Stars.svg";
import AlgoliaRangeSlider from "../../../common/components/AlgoliaRangeSlider/AlgoliaRangeSlider";
import GroupedMultiSelect from "../GroupedMultiSelect/GroupedMultiSelect";
import CheckboxWrapper from "../../../branding/componentWrapper/CheckboxWrapper";
import AudienceSelect from "../AudienceSelect/AudienceSelect";
import { useRefinementHandlers } from "../useRefinementHandlers";
import { useRefinementList } from "react-instantsearch";

const locations = [
  { label: "India", value: "india" },
  { label: "Russia", value: "russia" },
  { label: "USA", value: "usa" },
];

const TEMPO_CHIP_VALUES = [
  "Slow",
  "Medium Slow",
  "Medium",
  "Medium Fast",
  "Fast",
];

const FilterSidebar = ({
  open,
  onClose,
  trackTypeFilters,
  filteredTags,
  tracks,
  //setSidebarFilters
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openSections, setOpenSections] = useState({});
  const [selectedTempo, setSelectedTempo] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedStems, setSelectedStems] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState([]);
  const [searchMap, setSearchMap] = useState({});
  const [bpmDefaults, setBpmDefaults] = useState({ min: null, max: null });

  const [selectedFilters, setSelectedFilters] = useState({});

  const { filterConfigs, tempoFilter, eventTagsFilter, momentTagsFilter } =
    useRefinementHandlers();

  const eventMomentOptions = [
    {
      group: "Events",
      items: eventTagsFilter.items.map((item) => ({
        label: item.label,
        value: item.value,
        isRefined: item.isRefined,
        refine: eventTagsFilter.refine,
      })),
    },
    {
      group: "Moments",
      items: momentTagsFilter.items.map((item) => ({
        label: item.label,
        value: item.value,
        isRefined: item.isRefined,
        refine: momentTagsFilter.refine,
      })),
    },
  ];

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  function buildAlgoliaAndFilters(selectedFilters) {
    return Object.entries(selectedFilters)
      .map(([key, values]) =>
        values.map((val) => `${key}:"${val}"`).join(" AND ")
      )
      .filter(Boolean)
      .join(" AND ");
  }

  const handleFilterChange = (attribute, value) => {
    const updatedFilters = { ...selectedFilters };
    const currentValues = updatedFilters[attribute] || [];

    if (currentValues.includes(value)) {
      updatedFilters[attribute] = currentValues.filter((v) => v !== value);
    } else {
      updatedFilters[attribute] = [...currentValues, value];
    }

    setSelectedFilters(updatedFilters);

    // Build the string and pass it up to the parent
    const filterString = buildAlgoliaAndFilters(updatedFilters);
    //setSidebarFilters(filterString);
  };

  useEffect(() => {
    const currentSelectedTempo = tempoFilter.items.find(
      (item) => item.isRefined
    );
    setSelectedTempo(currentSelectedTempo?.value || null);
  }, [tempoFilter.items]);

  const renderTempoChip = (tempo) => (
    <button
      key={tempo}
      className={`tempoChip ${selectedTempo === tempo ? "active" : ""}`}
      onClick={() => {
        const isCurrentlySelected = selectedTempo === tempo;

        // Unrefine all existing tempo refinements
        tempoFilter.items.forEach((item) => {
          if (item.isRefined) tempoFilter.refine(item.value); // unselect
        });

        // Refine new one if different
        if (!isCurrentlySelected) {
          tempoFilter.refine(tempo);
          setSelectedTempo(tempo);
        } else {
          setSelectedTempo(null);
        }
      }}
    >
      <span>{tempo}</span>
    </button>
  );

  const renderFilterSection = ({
    attribute,
    label,
    items,
    refine,
    searchForItems,
    labelGetter,
    itemFilter,
    canToggleShowMore,
    isShowingMore,
    toggleShowMore,
    hideSearch, // 🚀 added
  }) => {
    const localSearch = searchMap[label] || "";

    if (localSearch && canToggleShowMore && !isShowingMore) {
      toggleShowMore();
    }

    const displayedItems = (
      itemFilter ? items.filter(itemFilter) : items
    ).filter((item) =>
      labelGetter(item.value).toLowerCase().includes(localSearch.toLowerCase())
    );

    return (
      <>
        {!hideSearch && (
          <input
            type="text"
            className="filter-search-input"
            placeholder={`Search ${label}`}
            value={localSearch}
            onChange={(e) => {
              const val = e.target.value;
              setSearchMap((prev) => ({ ...prev, [label]: val }));
              if (searchForItems) {
                searchForItems(val);
              }
            }}
          />
        )}
        {displayedItems.map((item) => (
          <label
            key={item.value}
            className="checkbox-item"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              paddingLeft: "1rem",
            }}
          >
            <CheckboxWrapper
              name="selectedTracks"
              checked={item.isRefined}
              onChange={() => {
                //handleFilterChange(attribute, item.value);
                refine(item.value);
                console.log("refine item.value", item.value);
                // dispatch(setTrackFilters({[attribute]: item.value }));
              }}
              label={`${labelGetter(item.value)} (${item.count})`}
            />
          </label>
        ))}
        {canToggleShowMore && (
          <button className="showMoreBtn" onClick={toggleShowMore}>
            {isShowingMore ? "Show Less" : "Show More"}
          </button>
        )}
      </>
    );
  };

  return (
    <div className={`filter-sidebar ${open ? "open" : "closed"}`}>
      <span className="filter-title">Filter By</span>
      <div className="filters">
        {/* BPM (Tempo) Section */}
        <div className="accordion-section" data-filterlabel="BPM (Tempo)">
          <div
            className="accordion-header"
            onClick={() => toggleSection("BPM (Tempo)")}
          >
            <AccArrow
              className={`accordion-icon ${
                openSections["BPM (Tempo)"] ? "open" : ""
              }`}
            />
            <span>BPM (Tempo)</span>
          </div>
          {openSections["BPM (Tempo)"] && (
            <div className="accordion-body" data-filterbody="BPM (Tempo)">
              <AlgoliaRangeSlider
                attribute="bpm"
                label="BPM Range"
                onRangeInfo={setBpmDefaults}
              />
              <div className="ais-RangeSlider-tempo">
                {/* Row 1 */}
                <div className="ais-RangeSlider-tempoSlowFast">
                  {TEMPO_CHIP_VALUES.slice(0, 3).map(renderTempoChip)}
                </div>
                {/* Row 2 */}
                <div className="ais-RangeSlider-tempoRange">
                  {TEMPO_CHIP_VALUES.slice(3).map(renderTempoChip)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Other Filters */}
        {[
          ...filterConfigs,
          {
            label: "Event/Moment Type",
            renderItems: () => (
              <GroupedMultiSelect
                options={eventMomentOptions}
                selectedValues={selectedEvents}
                onChange={setSelectedEvents}
              />
            ),
          },
          // {
          //   label: "Stems",
          //   renderItems: () => (
          //     <GroupedMultiSelect
          //       options={tracks?.Stems || []}
          //       selectedValues={selectedStems}
          //       onChange={setSelectedStems}
          //     />
          //   ),
          // },
          /* {
            label: "Audience",
            renderItems: () => (
              <AudienceSelect
                locations={tracks?.Audience?.locations || locations}
                onChange={(audienceData) => {
                  setSelectedAudience(audienceData);
                  dispatch(setTrackFilters({ audience: audienceData }));
                }}
              />
            ),
          }, */
        ].map((filter) => (
          <div
            className="accordion-section"
            key={filter.label}
            data-filterlabel={filter.label}
          >
            <div
              className="accordion-header"
              onClick={() => toggleSection(filter.label)}
            >
              <AccArrow
                className={`accordion-icon ${
                  openSections[filter.label] ? "open" : ""
                }`}
              />
              <span>{filter.label}</span>
            </div>
            {openSections[filter.label] && (
              <div className="accordion-body" data-filterbody={filter.label}>
                {/* <div className="ais-RangeSlider-tempo" > */}
                <div className="bodyblock">
                  {filter.renderItems
                    ? filter.renderItems()
                    : renderFilterSection(filter)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bottomBar">
        <ButtonWrapper
          variant="outlined"
          className="commision_button"
          onClick={() => navigate("/CustomTrackForm")}
        >
          <Stars className="starIcon" />
          Commission a Track
        </ButtonWrapper>
      </div>
    </div>
  );
};

export default FilterSidebar;
