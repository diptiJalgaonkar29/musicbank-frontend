import React, { useCallback, useRef, useState } from "react";
import ActiveProjectListItem from "../ActiveProjectListItem/ActiveProjectListItem";
import ProjectTableHeader from "../ProjectTableHeader/ProjectTableHeader";
import "./ActiveProjectList.css";
import { LazyLoadComponent } from "../../common/components/LazyLoadComponent/LazyLoadComponent";
import AsyncService from "../../networking/services/AsyncService";
import EditProjectInfoModal from "../../common/components/EditProjectInfoModal/EditProjectInfoModal";
import ProjectGridItem from "../ProjectGridItem/ProjectGridItem";
import { MultiSelect } from "react-multi-select-component";
import { SpinnerDefault } from "../../common/components/Spinner/Spinner";
import ActiveProjectTableHeader from "../ActiveProjectTableHeader/ActiveProjectTableHeader";

const ActiveProjectList = ({
  selectedProjectType,
  filteredProjectDataArr,
  setFilteredProjectDataArr,
  getNewProjects,
  creditValue,
  setViewType,
  viewType,
  setSelectedProjectType,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editProjectInfo, setEditProjectInfo] = useState({});
  const [selectedProject, setSelectedProject] = useState([]);

  const sortingMeta = useRef({
    sortedBy: "changeTimestamp",
    isAscendingOrder: false,
  });

  const onDeleteClick = (id) => {
    setIsLoading(true);
    AsyncService.remove(`/project/deleteProject/${id}`)
      .then((response) => {
        getNewProjects("active");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const restoreDeletedProject = (id) => {
    setIsLoading(true);
    AsyncService.loadData(`/project/restoreDeletedProject/${id}`)
      .then((response) => {
        getNewProjects("deleted");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const openEditProjectModal = (e, project) => {
    e.stopPropagation();
    setEditProjectInfo({
      isOpen: true,
      name: project?.name,
      projectID: project?.projectId,
      description: project?.description,
      status: project?.status,
      project_logo: "",
    });
  };

  const handleChange = useCallback((e) => {
    setSelectedProject(e);
  }, []);

  if (filteredProjectDataArr?.length === 0) {
    return <h3 className="no_filtered_data_text">No projects found !</h3>;
  }

  return (
    <>
      {isLoading ? (
        <div className="project_spinner_container">
          <SpinnerDefault />
        </div>
      ) : (
        <div className="Activepage_content">
          {filteredProjectDataArr?.length > 0 && viewType === "List" && (
            <ActiveProjectTableHeader
              selectedProjectType={selectedProjectType}
              filteredProjectDataArr={filteredProjectDataArr}
              setFilteredProjectDataArr={setFilteredProjectDataArr}
              sortingMeta={sortingMeta}
            />
          )}
          <div
            className={`${
              viewType === "List" ? "page_project_field " : "page_project_grid"
            } ${selectedProjectType.replace(" ", "_")}`}
          >
            {selectedProjectType === "Active Projects" && (
              <>
                {filteredProjectDataArr?.map(
                  (project, i) =>
                    project?.status === "active" && (
                      <React.Fragment key={`${project?.name}-${i}`}>
                        {viewType === "List" ? (
                          <LazyLoadComponent
                            ref={React.createRef()}
                            defaultHeight={64}
                          >
                            <ActiveProjectListItem
                              projectItem={project}
                              projectType={selectedProjectType}
                              getNewProjects={getNewProjects}
                              onDeleteClick={onDeleteClick}
                              creditValue={creditValue}
                              openEditClick={(e) =>
                                openEditProjectModal(e, project)
                              }
                            />
                          </LazyLoadComponent>
                        ) : (
                          <LazyLoadComponent
                            ref={React.createRef()}
                            // defaultHeight={160}
                          >
                            <ProjectGridItem
                              projectItem={project}
                              projectType={selectedProjectType}
                              getNewProjects={getNewProjects}
                              onDeleteClick={onDeleteClick}
                              creditValue={creditValue}
                              openEditClick={(e) =>
                                openEditProjectModal(e, project)
                              }
                            />
                          </LazyLoadComponent>
                        )}
                      </React.Fragment>
                    )
                )}
                <EditProjectInfoModal
                  editProjectInfo={editProjectInfo}
                  onClose={() =>
                    setEditProjectInfo({ ...editProjectInfo, isOpen: false })
                  }
                  getNewProjects={getNewProjects}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ActiveProjectList;
