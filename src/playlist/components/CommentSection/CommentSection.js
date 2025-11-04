import React, { useEffect, useRef, useState, useCallback } from "react";
import { useIdleTimer } from "react-idle-timer";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { isMobile } from "react-device-detect";
import GoDownIcon from "@mui/icons-material/ArrowDropDown";

import DateUtils from "../../../common/utils/DateUtils";
import { getAllCommentsByPlaylistID } from "../../../redux/actions/playListCommentActions";
import ChatService from "../../services/ChatService";

import CommentElement from "./CommentElement/CommentElement";
import CreateNewCommentForm from "./CreateNewCommentForm/CreateNewCommentForm";
import "../../../_styles/Comments.css";

const IDLE_TIMEOUT = 9000;
const POLLING_TIMER = 3000;

const CommentSection = ({
  allComments,
  getComments,
  playlistID,
  isUnRegistered,
  mCode,
}) => {
  const [time, setTime] = useState(() =>
    DateUtils.toIsoString(new Date()).split("+")[0]
  );
  const [scrolled, setScrolled] = useState(false);
  const timerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const playlistIdExt = playlistID?.id;

  const scrollToBottom = useCallback((behavior) => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollIntoView({
      behavior: behavior === "smooth" ? "smooth" : "auto",
      block: "nearest",
      inline: "start",
    });

    if (behavior === "instant") setScrolled(true);
  }, []);

  const stopPolling = () => {
    clearInterval(timerRef.current);
  };

  const startPolling = useCallback(() => {
    stopPolling();
    timerRef.current = setInterval(() => {
      getItems();
    }, POLLING_TIMER);
  }, [time]);

  const handleIncomingComments = (id) => {
    getComments(id, isUnRegistered, mCode).then(() => {
      scrollToBottom("smooth");
    });
  };

  const getItems = useCallback(() => {
    const fetch = isUnRegistered
      ? ChatService.getAllByPlaylistIdAndLastSyncTimeUnregistered(
        playlistIdExt,
        time,
        mCode
      )
      : ChatService.getAllByPlaylistIdAndLastSyncTime(playlistIdExt, time);

    fetch.then((result) => {
      if (result.length > 0) {
        const newestTimestamp = result[result.length - 1].change_timestamp;
        setTime(newestTimestamp);
        handleIncomingComments(playlistIdExt);
      }
    });
  }, [time, playlistIdExt, isUnRegistered, mCode]);

  const onIdle = () => {
    stopPolling();
  };

  const onActive = () => {
    startPolling();
  };

  // useIdleTimer({
  //   timeout: IDLE_TIMEOUT,
  //   onIdle,
  //   onActive,
  //   debounce: 250,
  //   element: document,
  // });

  useEffect(() => {
    startPolling();
    scrollToBottom("instant");

    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (!scrolled) scrollToBottom("instant");
  }, [allComments]);

  return (
    <div className="CommentSection__container">
      <div className="CommentSections__amount">
        <span>
          {allComments?.length}{" "}
          {allComments?.length === 1 ? (
            <FormattedMessage id="playlist.comment.titleOne" />
          ) : (
            <FormattedMessage id="playlist.comment.titleMore" />
          )}
        </span>
        {!isMobile && (
          <span>
            <GoDownIcon
              className="CommentSections__amount--icon"
              onClick={() => scrollToBottom("smooth")}
            />
          </span>
        )}
      </div>

      <div className="CommentSections__messages">
        {allComments ? (
          <ul className="Comments__ul">
            {allComments.map((c) => (
              <CommentElement
                key={c.id * c.playlistId}
                dataProp={c}
                playlistID={playlistID}
                getCommentsProp={() =>
                  getComments(playlistIdExt, isUnRegistered, mCode)
                }
              />
            ))}
            <li className="Comments__BottomDummy" ref={messagesEndRef} />
          </ul>
        ) : (
          <p>
            <FormattedMessage id="app.common.loadingWithDashes" />
          </p>
        )}
      </div>

      {!isUnRegistered && (
        <div className="CommentSections__newComment">
          <CreateNewCommentForm
            playlistID={playlistID}
            getCommentsProp={() =>
              getComments(playlistIdExt, isUnRegistered, mCode)
            }
            ScrollToBottomProp={() => scrollToBottom("instant")}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  allComments: state.playListComments.allComments,
  playlistID: state.playlist.PlaylistByIdData,
  loadingComments: state.playListComments.loadingComment,
});

const mapDispatchToProps = (dispatch) => ({
  getComments: (playlistID, isUnRegistered, mCode) =>
    dispatch(getAllCommentsByPlaylistID(playlistID, isUnRegistered, mCode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentSection);
