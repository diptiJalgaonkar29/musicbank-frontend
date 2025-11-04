import React, { useEffect, useRef } from "react";
import sortByKey from "../utils/sortByKey";
import { ReactComponent as SortingAsc } from "../common/sortAsc.svg";
import { ReactComponent as SortingDesc } from "../common/sortDesc.svg";
import "./ActiveProjectTableHeader.css";

const ActiveProjectTableHeader = ({
  selectedProjectType,
  filteredProjectDataArr,
  setFilteredProjectDataArr,
  sortingMeta,
}) => {
  useEffect(() => {
    let sortedByLastUpdate = sortData("changetimestamp", "DESC");
    setFilteredProjectDataArr([...sortedByLastUpdate]);
  }, [selectedProjectType]);

  let projectHeaders = [
    {
      title: "Project Name",
      key: "name",
      width: "30%",
      padding: "0 15px",
      isSortable: false,
    },
    {
      title: "Owner",
      key: "count",
      width: "25%",
      padding: "0 20px",
      isSortable: false,
    },
    ["Active Projects", "Closed Projects"]?.includes(selectedProjectType) && {
      title: "Due Date",
      key: "newTimestamp",
      width: "20%",
      padding: "0 20px",
      isSortable: false,
    },
    ["Active Projects", "Closed Projects"]?.includes(selectedProjectType) && {
      title: "Type of Project",
      key: "Type",
      width: "25%",
      padding: "0 10px",
      isSortable: false,
    },
  ].filter((item) => Boolean(item));

  const sortData = (key, sortType) => {
    sortingMeta.current = {
      sortedBy: key,
      isAscendingOrder: sortType === "ASC" ? true : false,
    };

    return sortByKey(filteredProjectDataArr, key, sortType);
  };

  const getSortedDataBy = (key) => {
    let sortedData;
    let order;
    if (sortingMeta.current.sortedBy === key) {
      if (sortingMeta.current.isAscendingOrder) {
        order = "DESC";
        sortedData = sortData(key, order);
      } else {
        order = "ASC";
        sortedData = sortData(key, "ASC");
      }
    } else {
      order = "ASC";
      sortedData = sortData(key, "ASC");
    }
    return sortedData;
  };

  const handleSort = (sortBy) => {
    let sortedData = getSortedDataBy(sortBy);
    setFilteredProjectDataArr([...sortedData]);
  };

  return (
    <div className="Activeproject_table_header">
      {projectHeaders?.map((item, i) => (
        <div
          key={`item.title-${i}`}
          style={{ width: item.width }}
          className="project_table_header_item_container"
        >
          <p
            className="project_table_header_item_title boldFamily"
            style={{ padding: item.padding }}
          >
            {selectedProjectType === "Bin" && item?.title === "Credit"
              ? null
              : item.title}
          </p>
          {selectedProjectType === "Bin" && item?.title === "Credit"
            ? null
            : item.isSortable && (
                <div
                  className="arrow_container sort_icon"
                  onClick={() => {
                    handleSort(item.key);
                  }}
                >
                  <SortingAsc
                    width="24"
                    height="20"
                    className={`${
                      item.key === sortingMeta.current.sortedBy &&
                      sortingMeta.current.isAscendingOrder
                        ? "activeSort"
                        : "disableSort"
                    }`}
                  />
                  <SortingDesc
                    width="24"
                    height="20"
                    className={`${
                      item.key === sortingMeta.current.sortedBy &&
                      !sortingMeta.current.isAscendingOrder
                        ? "activeSort"
                        : "disableSort"
                    }`}
                    style={{
                      marginLeft: "-8px",
                    }}
                  />
                </div>
              )}
        </div>
      ))}
    </div>
  );
};

export default ActiveProjectTableHeader;
