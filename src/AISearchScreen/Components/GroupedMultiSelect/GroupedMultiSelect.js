// components/GroupedMultiSelect.jsx

import React, { useState } from "react";
import "./GroupedMultiSelect.css";
import CheckboxWrapper from "../../../branding/componentWrapper/CheckboxWrapper";

const GroupedMultiSelect = ({ options = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const isGrouped = options.length > 0 && options[0].items;

  const filtered = isGrouped
    ? options
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((group) => group.items.length > 0)
    : options.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleToggle = (item) => {
    // ✅ Trigger Algolia refine
    item.refine(item.value);
  };

  return (
    <div className="grouped-multiselect">
      <div className="dropdown-panel">
        <input
          type="text"
          className="filter-search-input"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isGrouped ? (
          filtered.map((group) => (
            <div key={group.group} className="dropdown-group">
              <div className="group-label">{group.group}</div>
              {group.items.map((item) => (
                <label key={item.value} className="checkbox-item">
                  <CheckboxWrapper
                    name="selectedTracks"
                    value={item.value}
                    checked={item.isRefined}
                    onChange={() => handleToggle(item)}
                  />
                  <span
                    className="checkbox-label"
                    onClick={() => handleToggle(item)}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          ))
        ) : (
          <div className="dropdown-group">
            {filtered.map((item) => (
              <label key={item.value} className="checkbox-item">
                <CheckboxWrapper
                  name="selectedTracks"
                  value={item.value}
                  checked={item.isRefined}
                  onChange={() => handleToggle(item)}
                />
                <span
                  className="checkbox-label"
                  onClick={() => handleToggle(item)}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupedMultiSelect;
