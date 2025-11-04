import React, { useEffect, useState } from "react";
import "./AudienceSelect.css";
import { MultiSelect } from "react-multi-select-component";

const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const AGE_GROUPS = [
  { label: "13-17", value: "13-17" },
  { label: "18-24", value: "18-24" },
  { label: "23-34", value: "23-34" },
  { label: "38-44", value: "38-44" },
  { label: "45-54", value: "45-54" },
  { label: "54-64", value: "54-64" },
  { label: "65+", value: "65+" },
];

const AudienceSelect = ({ locations = [], onChange }) => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedAges, setSelectedAges] = useState([]);

  const handleAgeChange = (newAges) => {
    if (newAges.some((a) => a.value === "all")) {
      setSelectedAges([AGE_GROUPS[0]]);
    } else {
      setSelectedAges(newAges);
    }
  };

  useEffect(() => {
    const gender = selectedGenders.map((g) => g.value);
    const ages = selectedAges.map((a) => a.value);
    const location = selectedLocations.map((l) => l.value);
    onChange?.({ location, gender, selectedAges: ages });
  }, [selectedLocations, selectedGenders, selectedAges]);

  return (
    <div className="audience-select">
      <div className="location form-group">
        <label>Location </label>
        <MultiSelect
          options={locations}
          value={selectedLocations}
          onChange={
            (selected) => setSelectedLocations(selected.slice(-1)) // Keep only the latest selected option
          }
          labelledBy="Select Location"
          className="location rmsc multi_select_genres_filter selectAll"
          overrideStrings={{
            selectSomeItems: "Select Location(s)",
            allItemsAreSelected: "All Locations Selected",
            selectAll: " ",
          }}
        />
      </div>

      <div className="form-group">
        <label>Gender</label>
        <MultiSelect
          options={GENDER_OPTIONS}
          value={selectedGenders}
          onChange={setSelectedGenders}
          disableSearch
          hasSelectAll
          labelledBy="Select Gender"
          className="rmsc multi_select_genres_filter selectAll"
          overrideStrings={{
            selectSomeItems: "Select Gender(s)",
            allItemsAreSelected: "All Genders Selected",
            selectAll: "All Genders",
          }}
        />
      </div>

      <div className="form-group">
        <label>Age</label>
        <MultiSelect
          options={AGE_GROUPS}
          value={selectedAges}
          onChange={handleAgeChange}
          disableSearch
          hasSelectAll
          labelledBy="Select Age"
          className="rmsc multi_select_genres_filter selectAll"
          overrideStrings={{
            selectSomeItems: "Select Age Group(s)",
            allItemsAreSelected: "All Age Groups Selected",
            selectAll: "All Ages",
          }}
        />
      </div>
    </div>
  );
};

export default AudienceSelect;
