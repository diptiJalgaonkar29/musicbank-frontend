import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./ProjectsPage.css";
import ProjectList from "./ProjectList/ProjectList";
import ProjectPageHeader from "./ProjectPageHeader/ProjectPageHeader";
import AsyncService from "../networking/services/AsyncService";
import MainLayout from "../common/components/MainLayout/MainLayout";
import { SpinnerDefault } from "../common/components/Spinner/Spinner";
import _ from 'lodash';

const projectTypes = {
  "Active Projects": "active",
  "Closed Projects": "downloaded",
  "Bin": "deleted",
};

export default function BucketList() {
  const [originalProjectDataArr, setOriginalProjectDataArr] = useState([]); // New state for original data
  const [filteredProjectDataArr, setFilteredProjectDataArr] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [creditValue, setCreditValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState("List");
  const [selectedProjectType, setSelectedProjectType] =
    useState("Active Projects");

  const getAllCreditValue = (trackInfo) => {
    return trackInfo?.reduce((total, item) => {
      return total + ((item?.credit === 1 ? item?.paid : item?.credit === 2 ? item?.radio : item?.unpaid) || 0); // Add paid value or 0 if undefined
    }, 0);
  }

  const fetchNewProjectsq = (status) => {
    setLoading(true);
    AsyncService.loadData(`project/getProjectsByStatus/${status}`)
      .then((response) => {
        let modData = response?.data?.map((track) => {
          const mergedTrackInfo = track?.trackInfo?.map((trackInfo) => {
            const audioType = _.find(track?.credit, { trackId: trackInfo?.trackId });
            return {
              ...trackInfo, ...audioType,
              paid: track?.downloaded_trackids?.includes(trackInfo?.trackId) ? 0 : trackInfo?.paid > 0 ? trackInfo?.paid : track?.brandCredit?.paid,
              unpaid: track?.downloaded_trackids?.includes(trackInfo?.trackId) ? 0 : trackInfo?.unpaid > 0 ? trackInfo?.unpaid : track?.brandCredit?.unpaid,
              radio: track?.downloaded_trackids?.includes(trackInfo?.trackId) ? 0 : trackInfo?.radio > 0 ? trackInfo?.radio : track?.brandCredit?.radio
            };
          });

          return { ...track, trackInfo: mergedTrackInfo };
        })?.map((data) => {
          return { ...data, credit: getAllCreditValue(data?.trackInfo) }
        });

        setOriginalProjectDataArr(modData); // Set original data
        setFilteredProjectDataArr(modData); // Set filtered data to original data
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setOriginalProjectDataArr([]); // Set original data
        setFilteredProjectDataArr([]); // Set filtered data to original data
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNewProjectsq(projectTypes[selectedProjectType]);
  }, [selectedProjectType]);

  useEffect(() => {
    searchTableData(searchQuery);
  }, [searchQuery]);

  const searchTableData = (searchQuery) => {
    if (searchQuery === "") {
      setFilteredProjectDataArr(originalProjectDataArr); // Reset to original data if search query is empty
    } else {
      const filteredData = originalProjectDataArr.filter((project) => {
        return project.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredProjectDataArr(filteredData);
    }
  };

  const getCreditInfoByCompanyOrBrand = useCallback(() => {
    let userId = Number(localStorage?.getItem("brandId"))

    if (!userId) return
    console.log(userId)
    AsyncService.loadData("users/getUserInternalOrExternalUser")
      .then((response) => {
        // 1 = "internal" & 2 = "external"
        AsyncService?.loadData(`credit/getCreditOfBrand?${response?.data?.companyType === 1 ? "brandId" : "companyId"}=${response?.data?.companyType === 1 ? userId : response?.data?.id}`)
          .then((creditResponse) => {
            setCreditValue(creditResponse?.data?.creditremaining)
          })
          .catch((error) => {
            console.log(error)
          })
      }).catch((err) => {
        console.log(err);
      });
  }, [])

  useEffect(() => {
    getCreditInfoByCompanyOrBrand()
  }, [creditValue]);

  return (
    <MainLayout>
      {loading ? (
        <div className="project_loader">
          <SpinnerDefault />
        </div>
      ) : (
        <div className="projects_container">
          <ProjectPageHeader
            selectedProjectType={selectedProjectType}
            setSelectedProjectType={setSelectedProjectType}
            setSearchQuery={setSearchQuery}
            getNewProjects={fetchNewProjectsq}
            creditValue={creditValue}
            setViewType={setViewType}
            viewType={viewType}
          />
          <ProjectList
            selectedProjectType={selectedProjectType}
            filteredProjectDataArr={filteredProjectDataArr}
            setFilteredProjectDataArr={setFilteredProjectDataArr || []}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            getNewProjects={fetchNewProjectsq}
            setSelectedProjectType={setSelectedProjectType}
            creditValue={creditValue}
            setViewType={setViewType}
            viewType={viewType}
          />
        </div>
      )}
    </MainLayout>
  );
}
