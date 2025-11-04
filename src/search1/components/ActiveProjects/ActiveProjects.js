import { useCallback, useEffect, useState } from "react";
import "./ActiveProjects.css";
import _ from "lodash";
import AsyncService from "../../../networking/services/AsyncService";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import ActiveProjectList from "../../../bucketlist/ActiveProjectList/ActiveProjectList";

export default function ActiveProjects() {
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
      return (
        total +
        ((item?.credit === 1
          ? item?.paid
          : item?.credit === 2
          ? item?.radio
          : item?.unpaid) || 0)
      ); // Add paid value or 0 if undefined
    }, 0);
  };

  const fetchNewProjectsq = (status) => {
    setLoading(true);
    AsyncService.loadData(`project/getProjectsByStatus/${status}`)
      .then((response) => {
        let modData = response?.data
          ?.map((track) => {
            const mergedTrackInfo = track?.trackInfo?.map((trackInfo) => {
              const audioType = _.find(track?.credit, {
                trackId: trackInfo?.trackId,
              });
              return {
                ...trackInfo,
                ...audioType,
                paid: track?.downloaded_trackids?.includes(trackInfo?.trackId)
                  ? 0
                  : trackInfo?.paid > 0
                  ? trackInfo?.paid
                  : track?.brandCredit?.paid,
                unpaid: track?.downloaded_trackids?.includes(trackInfo?.trackId)
                  ? 0
                  : trackInfo?.unpaid > 0
                  ? trackInfo?.unpaid
                  : track?.brandCredit?.unpaid,
                radio: track?.downloaded_trackids?.includes(trackInfo?.trackId)
                  ? 0
                  : trackInfo?.radio > 0
                  ? trackInfo?.radio
                  : track?.brandCredit?.radio,
              };
            });

            return { ...track, trackInfo: mergedTrackInfo };
          })
          ?.map((data) => {
            return { ...data, credit: getAllCreditValue(data?.trackInfo) };
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
    fetchNewProjectsq(["active"]);
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
    let userId = Number(localStorage?.getItem("brandId"));

    if (!userId) return;
    console.log(userId);
    AsyncService.loadData("users/getUserInternalOrExternalUser")
      .then((response) => {
        // 1 = "internal" & 2 = "external"
        AsyncService?.loadData(
          `credit/getCreditOfBrand?${
            response?.data?.companyType === 1 ? "brandId" : "companyId"
          }=${response?.data?.companyType === 1 ? userId : response?.data?.id}`
        )
          .then((creditResponse) => {
            setCreditValue(creditResponse?.data?.creditremaining);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getCreditInfoByCompanyOrBrand();
  }, [creditValue]);

  return (
    <>
      {loading ? (
        <div className="project_loader">
          <SpinnerDefault />
        </div>
      ) : (
        <div className="Activeprojects_container">
          <div style={{ marginBottom: "20px", marginTop: "20px" }}>
            <span
              style={{
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "20px",
                lineHeight: "120%",
                letterSpacing: "0",
                verticalAlign: "middle",
              }}
            >
              My Active Projects
            </span>
          </div>
          <ActiveProjectList
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
    </>
  );
}
