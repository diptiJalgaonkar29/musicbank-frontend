import moment from 'moment';
import "./ProjectGridItem.css";
import { ReactComponent as FileIcon } from "../../projectcommon/file.svg";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ProjectGridItem({
  projectItem,
  creditValue,
  projectType,
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
  const [projectID, setProjectID] = useState(null);

  const handleRedirect = (id) => {
    // navigate(`/track-download/${id}`);
    navigate(`/track-download/${id}`, { state: { credits: creditValue || 0 } });
  };
  return (
    <div
      className="project_grid_item"
      onClick={() =>
        ["Active Projects", "Closed Projects"]?.includes(projectType)
          ? handleRedirect(projectId)
          : {}
      }
    >
      <div className="card-icon">
        <FileIcon style={{
          width: "15%",
          height: "80%",
          display: 'flex',
          flexDirection: "column",
          justifyContent: 'center',
        }} />
      </div >
      <h2 className="card-title">{name}</h2>
      <div className="card-assets">
        {projectItem?.count || 0} Assets
      </div>
      <div className="card-updated">
        Updated{" "}
        {moment.utc(newTimestamp || changeTimestamp).local().fromNow()}
      </div>
    </div >
  );
}
