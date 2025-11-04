import React, { useCallback, useEffect, useState } from "react";
import { ReactComponent as DownArrow } from "../common/downArrow.svg";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProjectPageHeader.css";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import AddToProject from "../../addtobucket/AddToProject";
import { ReactComponent as GridActive } from "../common/Grid.svg";
import { ReactComponent as GridNotActive } from "../common/GridNotActive.svg";
import { ReactComponent as DeleteIcon } from "../common/DeleteIcon.svg";
import MenuWrapper from "../../branding/componentWrapper/MenuWrapper/MenuWrapper";
import MenuItemWrapper from "../../branding/componentWrapper/MenuWrapper/MenuItemWrapper";
import SearchInputWrapper from "../../branding/componentWrapper/SearchInputWrapper";
import IconWrapper from "../../branding/componentWrapper/IconWrapper";

const ProjectPageHeader = ({
  selectedProjectType,
  setSelectedProjectType,
  searchQuery,
  setSearchQuery,
  getNewProjects,
  creditValue,
  setViewType,
  viewType,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [projectModal, setProjectModal] = useState(false);
  let location = useLocation();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const projectMenuItems = [
    {
      menuTitle: "Active Projects",
      onClick: () => {
        setSelectedProjectType("Active Projects");
        handleClose();
      },
      icon: <GridActive />,
    },
    {
      menuTitle: "Closed Projects",
      onClick: () => {
        setSelectedProjectType("Closed Projects");
        handleClose();
      },
      icon: <GridNotActive />,
    },
    {
      menuTitle: "Bin",
      onClick: () => {
        setSelectedProjectType("Bin");
        handleClose();
      },
      icon: <DeleteIcon />,
    },
  ];

  return (
    <>
      <div className="page_header">
        {location?.pathname !== "/predict/" ? (
          <p className="page_header_option boldFamily" onClick={handleClick}>
            {selectedProjectType}
            <DownArrow />
          </p>
        ) : (
          <div className="predict_header_wrapper">
            <h2>Predict</h2>
            <p>
              Create or select a project, include music tracks and provide
              project details, then this feature analyzes the track fit and
              suggests the best matches to enhance your project’s sound. You can
              find your prediction reports inside each project, under
              “Prediction Reports”
            </p>
          </div>
        )}

        <MenuWrapper
          id="project_menu_dropdown"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {projectMenuItems.map((data) => (
            <MenuItemWrapper
              className="project_menu_item"
              onClick={data.onClick}
              key={data.menuTitle}
            >
              {data.icon}
              {data.menuTitle}
            </MenuItemWrapper>
          ))}
        </MenuWrapper>
        <div className="page_header_viewType_Add">
          {/* <div>
            <ButtonWrapper
              variant="outlined"
              onClick={() =>
                // brandType !== 1 &&
                navigate("/credit-request/", { state: { creditValue } })}
            >
              Your Tokens: {creditValue || 0}
            </ButtonWrapper>
          </div> */}
          <div onClick={() => setViewType("List")}>
            <IconWrapper
              icon="ListView"
              width="24"
              height="20"
              className={
                viewType === "List"
                  ? "active_project_view"
                  : "inactive_project_view"
              }
            />
          </div>
          <div onClick={() => setViewType("Grid")}>
            <IconWrapper
              icon="GridView"
              width="24"
              height="20"
              className={
                viewType === "Grid"
                  ? "active_project_view"
                  : "inactive_project_view"
              }
            />
          </div>
          <ButtonWrapper variant="filled" onClick={() => setProjectModal(true)}>
            <p>
              <IconWrapper icon="AddIcon" />
              New Project
            </p>
          </ButtonWrapper>
        </div>
      </div>
      {location?.pathname !== "/predict/" ? (
        <div className="page_search_bar">
          <SearchInputWrapper
            //value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            setValue={setSearchQuery}
          />
        </div>
      ) : null}
      {selectedProjectType === "Bin" && (
        <p className="archive_note">
          Deleted projects stay in Archive for <span>90 days.</span>
        </p>
      )}
      <AddToProject
        open={projectModal}
        setOpen={setProjectModal}
        trackID={[]}
        type="Project"
        getNewProjects={getNewProjects}
        selectedProjectType={selectedProjectType}
      />
    </>
  );
};

export default ProjectPageHeader;
