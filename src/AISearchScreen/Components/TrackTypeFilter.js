// TrackTypeFilter.js
import React from "react";
import { useRefinementList } from "react-instantsearch";
import { MultiSelect } from "react-multi-select-component";

const TrackTypeFilter = ({ selectedLibraries, setSelectedLibraries }) => {
  const { items, refine } = useRefinementList({ attribute: "track_type_id", operator: "and" });

  const handleLibraryChange = (selected) => {
    items.forEach((item) => {
      if (item.isRefined) refine(item.value); // clear previous
    });
    selected.forEach((item) => refine(item.value)); // apply new
    setSelectedLibraries(selected);
  };

  return (
    <MultiSelect
      options={items.map((item) => ({ label: item.label, value: item.value }))}
      value={selectedLibraries}
      onChange={handleLibraryChange}
      disableSearch
      hasSelectAll
      labelledBy="Select"
      className="multi_select_music_library_filter selectAll"
      overrideStrings={{
        selectSomeItems: "Filter by Music Libraries",
        allItemsAreSelected: "Filter by Music Libraries",
        selectAll: "All Libraries",
      }}
      valueRenderer={() => "Filter by Music Libraries"}
    />
  );
};

export default TrackTypeFilter;
