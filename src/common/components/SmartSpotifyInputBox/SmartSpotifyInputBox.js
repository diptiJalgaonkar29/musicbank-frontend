import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./SmartSpotifyInputBox.css";
import trackExternalAPICalls from "../../services/trackExternalAPICalls";
import { LazyLoadComponent } from "../LazyLoadComponent/LazyLoadComponent";
import SearchResultsCard from "../../../cyanite/components/searchResultsCard/SearchResultsCard";

function SmartSpotifyInputBox({
  placeholder,
  value,
  rightButtons = [],
  onTrackSelect,
  isEmpty,
  setIsEmpty,
  setSearchFieldFlag,
  searchFieldFlag,
}) {
  const [searchItems, setSearchItems] = useState([]);
  // const [searchTerm, setSearchTerm] = useState(value);
  const [refreshToken, setRefreshToken] = useState(
    process.env.REACT_APP_API_SPOTIFY_REFRESH_TOKEN
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    refreshSpotifyToken();
  }, []);

  useEffect(() => {
    // setSearchTerm("");
    setSearchFieldFlag(false);
    setIsEmpty(true);
    setShowDropdown(false);
    if (contentRef.current) contentRef.current.innerText = ""; // Clear the contentEditable
  }, [searchFieldFlag]);

  // inside SmartSpotifyInputBox
  useEffect(() => {
    if (contentRef.current && value) {
      contentRef.current.innerText = value; // set text when value changes
      setIsEmpty(value.trim().length === 0);
    }
  }, [value]);
  const placeCaretAtEnd = (el) => {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
      placeCaretAtEnd(contentRef.current);
    }
  }, [searchFieldFlag, isEmpty]);

  const refreshSpotifyToken = () => {
    const qs = require("qs");
    let data = qs.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    let config = {
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization: `Basic ${process.env.REACT_APP_API_SPOTIFY_ACCESS_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        setRefreshToken(response.data.access_token);
      })
      .catch((error) => {
        console.log("Error refreshing token:", error);
      });
  };

  const autocomplete = (evt) => {
    let text = evt.target.innerText; // Get the innerText of contentEditable div
    // setSearchTerm(text); // Update the state with the new text
    setIsEmpty(text.trim().length === 0); // Check if text is empty and update state

    if (text.length >= 3) {
      setShowDropdown(true);
      axios
        .get(
          `https://api.spotify.com/v1/search?q=${text}&type=track&limit=20`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        )
        .then((res) => {
          trackExternalAPICalls({
            url: `https://api.spotify.com/v1/search?q=${text}&type=track&limit=20`,
            requestData: "",
            usedFor: "spotifySearch",
            serviceBy: "Spotify",
            statusCode: 200,
            statusMessage: "",
          });
          setSearchItems(res.data.tracks.items);
        })
        .catch((err) => {
          console.log("Error fetching Spotify data:", err);
          trackExternalAPICalls({
            url: `https://api.spotify.com/v1/search?q=${text}&type=track&limit=20`,
            requestData: "",
            usedFor: "spotifySearch",
            serviceBy: "Spotify",
            statusCode: err?.statusCode || "404",
            statusMessage: err?.message,
          });
          setSearchItems([]);
        });
    } else {
      setSearchItems([]);
      setShowDropdown(false);
    }
  };

  const selectItem = (id) => {
    const selectedItem = searchItems.find((item) => item.id === id);
    const { name, uri, popularity } = selectedItem;
    //setSearchTerm(name);
    setSearchItems([]);
    setShowDropdown(false);
    onTrackSelect(id);
  };

  return (
    <div className="SmartSpotifyInputBox">
      <div className="smart-input-wrapper">
        <div className="smart-input-inner">
          <div
            className="smart-textarea-contenteditable"
            contentEditable
            ref={contentRef}
            onInput={autocomplete}
            suppressContentEditableWarning={true}
          />
          {isEmpty && <div className="placeholder-text">{placeholder}</div>}
        </div>

        {showDropdown && searchItems.length > 0 && (
          <div className="dropdown-container">
            <table className="autoTable spotifyTracksList">
              <tbody>
                {searchItems.map((item, idx) => (
                  <LazyLoadComponent
                    ref={React.createRef()}
                    defaultHeight={50}
                    key={idx}
                  >
                    <tr
                      className="sptactive autoTr"
                      onClick={() => selectItem(item.id)}
                    >
                      <td>
                        <SearchResultsCard
                          data_type="spotify"
                          track_name={item.name}
                          artist_name={item.artists[0].name}
                          preview_image_url={item.album.images[2].url}
                        />
                      </td>
                    </tr>
                  </LazyLoadComponent>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {rightButtons.length > 0 && (
          <div className="right-buttons">
            {rightButtons.map((btn, idx) => (
              <button
                key={idx}
                className="right-btn"
                onClick={btn.onClick}
                title={btn.label}
              >
                {btn.icon || btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartSpotifyInputBox;
