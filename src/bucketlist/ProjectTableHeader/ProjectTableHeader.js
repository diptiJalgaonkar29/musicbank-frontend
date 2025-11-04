import React, { useEffect, useRef } from "react";
import sortByKey from "../utils/sortByKey";
import { ReactComponent as SortingAsc } from "../common/sortAsc.svg";
import { ReactComponent as SortingDesc } from "../common/sortDesc.svg";
import "./ProjectTableHeader.css";

const ProjectTableHeader = ({
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
      width: "20%",
      padding: "0 15px",
      isSortable: true,
    },
    {
      title: "Assets",
      key: "count",
      width: "8%",
      padding: "0 20px",
      isSortable: true,
    },
    ["Active Projects", "Closed Projects"]?.includes(selectedProjectType) && {
      title: "Date Created",
      key: "newTimestamp",
      width: "15%",
      padding: "0 20px",
      isSortable: true,
    },
    {
      title: "Last Edit",
      key: "changeTimestamp",
      width: "15%",
      padding: "0 20px",
      isSortable: true,
    },
    selectedProjectType === "Bin" && {
      title: "Date deleted",
      key: "deleteTimestamp",
      width: "15%",
      padding: "0 20px",
      isSortable: true,
    },
    {
      title: "Description",
      key: "description",
      width: "22%",
      padding: "0 10px",
      isSortable: true,
    },
    ["Active Projects"]?.includes(selectedProjectType) && {
      title: "Tokens Used",
      key: "credit",
      width: "11%",
      padding: "0 10px",
      isSortable: true,
    },
    ["Active Projects", "Closed Projects"]?.includes(selectedProjectType) && {
      title: "Type of Project",
      key: "Type",
      width: "13%",
      padding: "0 10px",
      isSortable: true,
    },
    {
      title: "",
      key: "action",
      width: "80px",
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
    <div className="project_table_header">
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

export default ProjectTableHeader;
