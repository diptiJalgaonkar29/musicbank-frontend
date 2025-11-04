import React, { useEffect, useMemo, useState } from "react";
import { connectRefinementList } from "react-instantsearch-dom";
import "./FilterByTags.css";
import { useSelector } from "react-redux";

const FilterByTagsRefinementList = ({
  searchTerm,
  refine,
  createURL,
  resetStateValues,
  items,
  setTags,
}) => {
  const { ampMoodTagsIdAndLabelObj } = useSelector((state) => state.taxonomy);
  const [tagsList, setTagsList] = useState([]);

  let ampMoodTagsIdAndLabels;
  try {
    ampMoodTagsIdAndLabels = Object.keys(ampMoodTagsIdAndLabelObj);
  } catch (error) {
    ampMoodTagsIdAndLabels = [];
  }

  useEffect(() => {
    try {
      // console.log("items", items);
      // console.log("ampMoodTagsIdAndLabelObj", ampMoodTagsIdAndLabelObj);

      if (
        items?.length === 0 ||
        JSON.stringify(ampMoodTagsIdAndLabelObj) === "{}"
      )
        return;
      // console.log("items and ampMoodTagsIdAndLabelObj are not empty");
      // console.log(
      //   "first tag name",
      //   ampMoodTagsIdAndLabelObj?.[items?.[0]?.label?.split("-")?.[1]]
      // );
      let tagsListArr = items?.map((item) => ({
        tagId: item?.label,
        tagname: ampMoodTagsIdAndLabelObj?.[item?.label?.split("-")?.[1]] || "",
        value: item?.value,
      }));
      setTagsList(tagsListArr);
    } catch (error) {
      console.log("error", error);
      setTagsList([]);
    }
  }, [items?.length, ampMoodTagsIdAndLabels?.length]);

  const filteredTags = useMemo(() => {
    try {
      if (!tagsList?.length || !searchTerm || searchTerm?.length < 3) return;
      // console.log("searchTerm", searchTerm);
      // console.log("tagsList", tagsList);
      let filteredTags =
        tagsList?.filter((tag) => {
          if (!tag?.tagname) return false;
          return tag?.tagname
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase());
        }) || [];
      setTags(filteredTags);
      return filteredTags;
    } catch (error) {
      console.log("error", error);
      setTags([]);
      return [];
    }
  }, [tagsList, searchTerm]);

  if (!filteredTags || filteredTags?.length === 0) {
    return <></>;
  }

  return (
    <div className="custSearchBoxForAll__data3">
      <ul className="filter_by_tags_list">
        {filteredTags?.slice(0, 10)?.map((item) => (
          <li
            key={`tag-${item?.tagname}`}
            className={`tag-${item?.tagname}`}
            style={{ cursor: "pointer" }}
          >
            <a
              href={createURL(item?.tagId)}
              onClick={(event) => {
                event.preventDefault();
                refine(item?.value);
                setTimeout(() => {
                  const win = window.open(
                    `/#/search_results_algolia/%3Fquery=`,
                    "_self"
                  );
                  win.focus();
                  resetStateValues();
                }, 500);
              }}
            >
              #{item?.tagname}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FilterByTags = connectRefinementList(FilterByTagsRefinementList);
