import React, { useEffect, useState } from "react";
import "./ProjectListItem.css";
import { useLocation, useNavigate } from "react-router-dom";
import AsyncService from "../../networking/services/AsyncService";
import { SpinnerDefault } from "../../common/components/Spinner/Spinner";
import { ReactComponent as FileIcon } from "../../projectcommon/file.svg";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import IconWrapper from "../../branding/componentWrapper/IconWrapper";
import ToolTipWrapper from "../../branding/componentWrapper/ToolTipWrapper";
import { ReactComponent as Flim } from "../../projectcommon/blackIcon/movietickets.svg";
import { ReactComponent as Music } from "../../projectcommon/blackIcon/Frame10500.svg";
import { ReactComponent as AI } from "../../projectcommon/blackIcon/VoiceAssistance.svg";
// import { ReactComponent as MusicBar } from "../../projectcommon/blackIcon/Music.svg";
import { ReactComponent as MusicBar } from "../../projectcommon/blackIcon/MusicBar.svg";

function formatProjectDate(timestamp) {
  if (timestamp !== null) {
    let date = new Date(timestamp);
    try {
      if (date != null) {
        let year = date.getFullYear()?.toString();
        let month = (date.getMonth() + 1)?.toString().padStart(2, "0");
        let day = date.getDate()?.toString().padStart(2, "0");
        return `${day}.${month}.${year}`;
      }
    } catch (error) {
      return "-";
    }
  } else {
    return "-";
  }
}

export default function ProjectListItem({
  projectItem,
  onProjectClick,
  getNewProjects,
  projectType,
  onRestoreClicked,
  openEditClick,
  onDeleteClick,
  restoreDeletedProject,
  creditValue,
  viewType = true, // Default to true for active view
}) {
  const {
    name,
    projectId,
    description,
    newTimestamp,
    changeTimestamp,
    trackInfo,
    deleteTimestamp,
  } = projectItem;

  const navigate = useNavigate();
  const location = useLocation();

  console.log("pathName", location?.pathname);

  const handleRedirect = (id) => {
    // navigate(`/track-download/${id}`);
    navigate(`/track-download/${id}`, {
      state: {
        credits: creditValue || 0,
        source: location?.pathname === "/projects/" ? 1 : 2,
      },
    });
  };

  return (
    <>
      <div
        className="projectName_container"
        onClick={() =>
          ["Active Projects", "Closed Projects"]?.includes(projectType)
            ? handleRedirect(projectId)
            : {}
        }
      >
        <FileIcon className="fileIcon" />
        <ToolTipWrapper title={name} style={{ flex: 1 }}>
          <p
            className={`projectName boldFamily`}
            onClick={
              projectType === "Active Projects" ? onProjectClick : () => {}
            }
          >
            {name}
          </p>
        </ToolTipWrapper>
        {projectType === "Active Projects" && (
          <div style={{ width: "20px", height: "20px" }}>
            <IconWrapper
              icon="Edit"
              className="edit_icon_project_list"
              onClick={openEditClick}
            />
          </div>
        )}
      </div>

      <div className="projectattr" style={{ width: "8%" }}>
        <p>{projectItem?.count}</p>
      </div>
      {["Active Projects", "Closed Projects"]?.includes(projectType) && (
        <div
          className="projectattr"
          style={{ width: projectType === "Closed Projects" ? "15%" : "13%" }}
        >
          <p>{formatProjectDate(newTimestamp)}</p>
        </div>
      )}
      <div
        className="projectattr"
        style={{
          width:
            projectType === "Closed Projects"
              ? "15%"
              : projectType === "Bin"
              ? "15%"
              : "13%",
        }}
      >
        <p>{formatProjectDate(changeTimestamp || newTimestamp)}</p>
      </div>
      {projectType === "Bin" && (
        <div className="projectattr" style={{ width: "15%" }}>
          <p>{formatProjectDate(deleteTimestamp)}</p>
        </div>
      )}
      <div
        className="projectattr"
        style={{
          width:
            projectType === "Closed Projects"
              ? "22%"
              : projectType === "Bin"
              ? "32%"
              : "20%",
        }}
      >
        <ToolTipWrapper title={description || "-"}>
          <p>{description || "-"}</p>
        </ToolTipWrapper>
      </div>
      {!["Bin", "Closed Projects"]?.includes(projectType) && (
        <div className="projectattr" style={{ width: "10%" }}>
          <p>{projectItem?.credit || 0}</p>
        </div>
      )}
      {!["Bin"]?.includes(projectType) && (
        <div className="projectattr" style={{ width: "13%" }}>
          <p>
            <span className="projectIcons">
              <Flim
                className={
                  viewType ? "active_project_view" : "inactive_project_view"
                }
              />
              <Music
                className={
                  viewType ? "active_project_view" : "inactive_project_view"
                }
              />
              <AI
                className={
                  viewType ? "active_project_view" : "inactive_project_view"
                }
              />
              <MusicBar
                className={
                  viewType ? "activeSS_project_view" : "inactive_project_view"
                }
              />
            </span>
          </p>
        </div>
      )}
      {projectType === "Active Projects" ? (
        <div
          onClick={() => onDeleteClick(projectId)}
          className="projectDelete"
          style={{ width: "80px" }}
        >
          <IconWrapper icon="Trash" fill={"var(--color-icon)"} />
        </div>
      ) : projectType === "Bin" ? (
        <div
          onClick={() => restoreDeletedProject(projectId)}
          className="projectattr"
          style={{ width: "80px" }}
        >
          <ButtonWrapper variant="filled" size="s">
            restore
          </ButtonWrapper>
        </div>
      ) : null}
    </>
  );
}
