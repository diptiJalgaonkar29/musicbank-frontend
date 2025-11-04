import React, { useEffect, useMemo, useState } from "react";
import "./FilterByTagsDB.css";
import { useDispatch } from "react-redux";
import { setTrackFilters } from "../../../redux/actions/trackFilterActions/trackFilterActions";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../networking/services/AxiosInstance";

const FilterByTagsDB = ({ searchTerm, setTags }) => {
  const [tagsList, setTagsList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (tagsList?.length === 0 && searchTerm?.length >= 1) {
      AxiosInstance.get("/trackMeta/getActiveTracks")
        .then((res) => {
          setTagsList(res?.data?.AMPTagCountList || []);
        })
        .catch((error) => {
          console.log("error", error);
          setTagsList([]);
        });
    }
  }, [searchTerm, tagsList?.length]);

  const filteredTags = useMemo(() => {
    try {
      if (!tagsList?.length || !searchTerm || searchTerm?.length < 3) return;
      let filteredTags =
        tagsList?.filter((tag) => {
          if (!tag?.name) return false;
          return tag?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
        }) || [];
      setTags(filteredTags);
      return filteredTags;
    } catch (error) {
      console.log("error", error);
      setTags([]);
      return [];
    }
  }, [tagsList?.length, searchTerm]);

  if (!filteredTags || filteredTags?.length === 0) {
    return <></>;
  }

  return (
    <div className="custSearchBoxForAll__data3">
      <ul className="filter_by_tags_list_db">
        {filteredTags?.slice(0, 10)?.map((item) => (
          <li
            key={`tag-${item?.name}`}
            className={`tag-${item?.name} filtered_tag`}
            style={{ cursor: "pointer" }}
          >
            <span
              onClick={() => {
                dispatch(
                  setTrackFilters({
                    tempo: [],
                    tag_amp_mainmood_ids: [],
                    tag_amp_allmood_ids: [
                      { label: item?.name, value: item?.tag_name },
                    ],
                    instrument_ids: [],
                    tag_genre: [],
                    assetTypeId: [],
                    tag_key: [],
                    tag_tempo: [],
                  })
                );
                setTimeout(() => {
                  navigate("/search_results");
                }, 150);
              }}
            >
              #{item?.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterByTagsDB;
