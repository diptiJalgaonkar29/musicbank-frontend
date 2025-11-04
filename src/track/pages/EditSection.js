import React from "react";
import MobileTrackCard from "../components/TrackPageTrackCard/MobileTrackCard";
import TrackCardSmall from "../components/TrackPageTrackCard/TrackCardSmall";
import { ResponsiveTabletViewCondition768 } from "../../common/utils/ResponsiveTabletViewCondition";

const renderHeadingForMastersAndEdits = (text, type) => {
  if (type === "web") {
    return (
      <div className="TrackPage__wrapper--headline--container">
        <div className="TrackPage__wrapper--headline">
          <h3>{text} </h3>
        </div>
      </div>
    );
  }
  if (type === "mobile") {
    return (
      <div className="TrackPage__Mobile__wrapper--headline--container">
        <div className="TrackPage__Mobile__wrapper--headline">
          <h3>{text} </h3>
        </div>
      </div>
    );
  }
};

const EditSectionCaseEdit = ({ editResults, playingIndex }) => {
  return editResults?.map((edit) => {
    if (edit) {
      return (
        <>
          <div
            className={
              ResponsiveTabletViewCondition768()
                ? "TrackPage__Mobile__wrapper--edits--content"
                : "TrackPage__wrapper--edits--content"
            }
          >
            {ResponsiveTabletViewCondition768() ? (
              <MobileTrackCard
                idProp={edit?.objectID}
                indexProp={edit?.objectID?.toString()}
                playingIndex={playingIndex}
                track_length={edit?.duration_in_sec}
                track_name={edit?.track_name}
                editTags={edit?.tag_all}
                editImageUrl={edit?.preview_image_url}
                editTrackUrl={edit?.preview_track_url}
              />
            ) : (
              <TrackCardSmall
                idProp={edit?.objectID}
                indexProp={edit?.objectID?.toString()}
                playingIndex={playingIndex}
                track_length={edit?.duration_in_sec}
                track_name={edit?.track_name}
                editTags={edit?.tag_all}
                editImageUrl={edit?.preview_image_url}
                editTrackUrl={edit?.preview_track_url}
              />
            )}
          </div>
        </>
      );
    } else {
      return null;
    }
  });
};

const EditSectionCaseMaster = ({ masterResults, playingIndex }) => {
  if (!masterResults) {
    return (
      <p className="TrackInfoAccordion_message" style={{ margin: "0px 2rem" }}>
        No tracks found
      </p>
    );
  }
  return (
    <>
      <div
        className={
          ResponsiveTabletViewCondition768()
            ? "TrackPage__Mobile__wrapper--edits--content"
            : "TrackPage__wrapper--edits--content"
        }
      >
        {ResponsiveTabletViewCondition768() ? (
          <MobileTrackCard
            idProp={masterResults?.objectID}
            playingIndex={playingIndex}
            track_length={masterResults?.duration_in_sec}
            track_name={masterResults?.track_name}
            editTags={masterResults?.tag_all}
            editImageUrl={masterResults?.preview_image_url}
            editTrackUrl={masterResults?.preview_track_url}
          />
        ) : (
          <TrackCardSmall
            idProp={masterResults?.objectID}
            indexProp={masterResults?.objectID?.toString()}
            playingIndex={playingIndex}
            track_length={masterResults?.duration_in_sec}
            track_name={masterResults?.track_name}
            editTags={masterResults?.tag_all}
            editImageUrl={masterResults?.preview_image_url}
            editTrackUrl={masterResults?.preview_track_url}
          />
        )}
      </div>
    </>
  );
};

export default ({
  hasEdits,
  editResults,
  hasMaster,
  masterResults,
  playingIndex,
}) => {
  if (hasEdits && editResults !== null) {
    return (
      <>
        <div
          className={
            ResponsiveTabletViewCondition768()
              ? "TrackPage__Mobile__wrapper--edits"
              : "TrackPage__wrapper--edits"
          }
        >
          {ResponsiveTabletViewCondition768()
            ? renderHeadingForMastersAndEdits("Edits", "mobile")
            : renderHeadingForMastersAndEdits("Edits", "web")}
          <div className="TrackPage__wrapper--edits--list">
            <EditSectionCaseEdit
              editResults={editResults}
              playingIndex={playingIndex}
            />
          </div>
        </div>
      </>
    );
  } else if (hasMaster && masterResults !== null) {
    return (
      <>
        <div
          className={
            ResponsiveTabletViewCondition768()
              ? "TrackPage__Mobile__wrapper--edits"
              : "TrackPage__wrapper--edits"
          }
        >
          {ResponsiveTabletViewCondition768()
            ? renderHeadingForMastersAndEdits("Master", "mobile")
            : renderHeadingForMastersAndEdits("Master", "web")}
          <div className="TrackPage__wrapper--edits--list">
            <EditSectionCaseMaster
              playingIndex={playingIndex}
              masterResults={masterResults}
            />
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
};
