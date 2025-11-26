import { useSearchBox, useCurrentRefinements } from "react-instantsearch";
import { ReactComponent as WhiteSearch } from "../../static/white-search.svg";
import { ReactComponent as SearchIcon } from "../../static/search2.0.svg";
import { ReactComponent as Spotify } from "../../static/spotify.svg";
import { ReactComponent as CloseRed } from "../../static/CloseRed.svg";
import { useContext, useEffect, useRef, useState } from "react";
import SmartInputBox from "../../common/components/SmartInputBox/SmartInputBox";
import SmartSpotifyInputBox from "../../common/components/SmartSpotifyInputBox/SmartSpotifyInputBox";
import { useRefinementHandlers } from "./useRefinementHandlers";
import { useDispatch, useSelector } from "react-redux";
import { setAiMusicGenerator } from "../../redux/actions/AIMusicGenerator/aiMusicGenerator";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import { SET_SIMIL_QUERY } from "../../redux/constants/actionTypes";
import getSuperBrandName from "./../../common/utils/getSuperBrandName";
import { brandConstants } from "./../../common/utils/brandConstants";
import getSuperBrandId from "../../common/utils/getSuperBrandId";
import { filter } from "lodash";

const displayMap = {
  track_name: "Track Name",
  amp_genre_tags: "Genre",
  tag_key: "Key",
  tag_tempo: "Tempo",
  amp_instrument_tags: "Instruments",
  amp_all_mood_tags: "Musical Feel",
  tag_soniclogo_mainmood_ids: "Musical Feel (Sonic)",
};

const brandId =
  BrandingContext._currentValue?.config?.brandId ||
  localStorage.getItem("brandId");

const CustomSearchBox = ({
  AIquery,
  setAIquery,
  //similquery,
  //setSimilQuery,
  selected,
  onTrackSelect,
  ontrackClose,
  handleUploadVideoBriefToTXt,
  isLoading,
  stopPolling,
  setBaseFilter,
  selectedFiles,
}) => {
  // alert(selected);
  let dispatch = useDispatch();
  const { refine } = useSearchBox();

  const debounceRef = useRef(null);
  const debounceTimer = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [searchFieldFlag, setSearchFieldFlag] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const ALGOLIA_APP_ID = "UGELINWMHK";
  const ALGOLIA_SEARCH_KEY = "ca0ae95e4a09ce03c09546001ac1a6d3";
  const ALGOLIA_INDEX_NAME = "tracksData_Search";
  const [triggerFetch, setTriggerFetch] = useState(true);
  const suggestionsRef = useRef(null);
  const { items } = useCurrentRefinements();
  const similQuery = useSelector((state) => state.search.similQuery);
  const similQuery1 = similQuery?.trim();
  console.log("similQuery1", similQuery1);
  const { config } = useContext(BrandingContext);
  const IconComponent =
    getSuperBrandName() === brandConstants.WPP ? SearchIcon : WhiteSearch;
  useEffect(() => {
    if (selected === "ai") {
      clearSpotifySearch();
      ontrackClose(1);
      removeRefinement("", "ALL");
      dispatch({ type: SET_SIMIL_QUERY, payload: "1" });
    }
  }, [selected]); // Make sure to include setAIquery as dependency

  const {
    genreRefine,
    instrumentRefine,
    keyRefine,
    tempoRefine,
    libraryRefine,
    emotionRefine,
    trackNameRefine,
  } = useRefinementHandlers();

  useEffect(() => {
    if (!triggerFetch) {
      setTriggerFetch(true); // reset for next time
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const trimmedQuery = AIquery.trim();
      if (trimmedQuery.length >= 3) {
        fetchCombinedSuggestions(trimmedQuery);
      } else {
        setSuggestions([]);
        refine("");
      }
    }, 400);

    return () => clearTimeout(debounceTimer.current);
  }, [AIquery]);
  useEffect(() => {
    // Flatten refinements into consistent shape
    const currentRefinements = items.flatMap((group) =>
      group.refinements.map((ref) => ({
        word: ref.label,
        attribute: group.attribute,
      }))
    );

    setHighlightedWords(currentRefinements);
  }, [items]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]); // hide dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const fetchCombinedSuggestions = async (queryText) => {
    console.log("Fetching suggestions for:", queryText);

    // Normalize spaces
    const cleanedQuery = queryText
      .replace(/&nbsp;/gi, " ")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Extract last word (if any)
    const lastWordMatch = cleanedQuery.match(/(?:^|\s)(\S+)$/);
    const lastWord = lastWordMatch ? lastWordMatch[1] : "";

    const queriesToRun = [];

    if (cleanedQuery.length >= 3) queriesToRun.push(cleanedQuery);

    if (
      lastWord &&
      lastWord.length >= 3 &&
      !highlightedWords.includes(lastWord.toLowerCase()) &&
      lastWord !== cleanedQuery
    ) {
      queriesToRun.push(lastWord);
    }

    // Fetch all suggestions
    const allResults = await Promise.all(queriesToRun.map(fetchSuggestions));
    console.log("All results:", allResults);

    // Flatten, filter hidden tags, and merge suggestions in one pass
    const hideMoodTags = (window.globalConfig?.HIDE_MOOD_TAGS || []).map((t) =>
      t.toLowerCase()
    );
    const hideGenreTags = (window.globalConfig?.HIDE_GENRE_TAGS || []).map(
      (t) => t.toLowerCase()
    );

    const filteredResults = allResults
      .flat()
      .filter(
        (entry) =>
          !hideMoodTags.some((tag) =>
            entry.keyword.toLowerCase().includes(tag)
          ) &&
          !hideGenreTags.some((tag) =>
            entry.keyword.toLowerCase().includes(tag)
          )
      );

    const merged = mergeSuggestions(filteredResults);
    setSuggestions(merged);
  };

  const mergeSuggestions = (list) => {
    const seen = new Set();
    return list.filter(({ keyword, attribute }) => {
      const key = `${keyword}|${attribute}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const fetchSuggestions = async (q) => {
    let serverName = "";
    let baseFilter;
    const superBrandId = getSuperBrandId();
    //console.log("Using Algolia index:", indexName, brandId);
    if (getSuperBrandName() === brandConstants.WPP) {
      serverName = config?.modules?.ServerName;
    } else {
      serverName = window.globalConfig?.SERVER_NAME;
    }

    if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
      baseFilter = `analysis_status=1 AND facet_brand_assigned:"${serverName}-${superBrandId}_${brandId}:true" AND facet_isTrackActive:"${serverName}-${superBrandId}_${brandId}:true" AND facet_trackStatus:"${serverName}-${superBrandId}_${brandId}:true"`;
    } else {
      baseFilter = `analysis_status=1 AND brands_assigned=${brandId} AND trackStatus:true AND sonichub_track_id>0`;
    }
    try {
      const response = await fetch(
        `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${ALGOLIA_INDEX_NAME}/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Algolia-API-Key": ALGOLIA_SEARCH_KEY,
            "X-Algolia-Application-Id": ALGOLIA_APP_ID,
          },
          body: JSON.stringify({
            query: q,
            highlightPreTag: "<em>",
            highlightPostTag: "</em>",
            attributesToHighlight: Object.keys(displayMap),
            hitsPerPage: 50,
            filters: baseFilter,
            //filters: `analysis_status = 1 AND brands_assigned = ${localStorage.getItem("brandId")}`,
            //filters: `analysis_status = 1 AND brands_assigned = ${brandId} AND trackStatus:true AND sonichub_track_id>0`,
          }),
        }
      );

      const data = await response.json();
      const nbHits = data.nbHits;
      const matchCountMap = {};

      const extract = (item, key) => {
        if (
          ["amp_genre_tags", "amp_instrument_tags", "amp_all_mood_tags"].some(
            (substring) => key.includes(substring)
          )
        ) {
          if (Array.isArray(item?.tag_names)) {
            // Return each fully matched tag separately (no join)
            return item.tag_names
              .filter((tag) => tag?.matchLevel === "full")
              .map((tag) => tag.value.replace(/<\/?em>/g, ""));
          }
          return item?.tag_names
            ? [item?.tag_names.replace(/<\/?em>/g, "")]
            : [];
        }

        // Non-nested fields → wrap single value in array
        return item?.value ? [item.value.replace(/<\/?em>/g, "")] : [];
      };

      data.hits.forEach((hit) => {
        const highlights = hit._highlightResult;
        for (const key in highlights) {
          if (!displayMap[key]) continue;

          const match = highlights[key];
          if (Array.isArray(match)) {
            match.forEach((item) => {
              const vals = extract(item, key); // now an array
              vals.forEach((val) => {
                if (val && item?.matchLevel !== "none") {
                  const suggestionKey = `${val}|${key}`;
                  if (!matchCountMap[suggestionKey]) {
                    matchCountMap[suggestionKey] = {
                      keyword: val,
                      rawMatchedText: val,
                      attribute: key,
                      count: 1,
                      totalHits: nbHits,
                    };
                  } else {
                    matchCountMap[suggestionKey].count += 1;
                  }
                }
              });
            });
          } else {
            const vals = extract(match, key);
            vals.forEach((val) => {
              if (val && match?.matchLevel !== "none") {
                const suggestionKey = `${val}|${key}`;
                if (!matchCountMap[suggestionKey]) {
                  matchCountMap[suggestionKey] = {
                    keyword: val,
                    rawMatchedText: val,
                    attribute: key,
                    count: 1,
                    totalHits: nbHits,
                  };
                } else {
                  matchCountMap[suggestionKey].count += 1;
                }
              }
            });
          }
        }
      });

      return Object.values(matchCountMap).map((entry) => ({
        // label: `${entry.keyword} in ${displayMap[entry.attribute]} (${entry.count}) (${entry.totalHits})`,
        label: `${entry.keyword} in ${displayMap[entry.attribute]}`, // count part commented for now
        ...entry,
      }));
    } catch (err) {
      console.error("Suggestion fetch error:", err);
      return [];
    }
  };

  const handleSuggestionClick = (sug) => {
    const { attribute, keyword } = sug;
    let keywordsToRefine = keyword
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    let newQuery = AIquery.trim();

    if (attribute === "track_name") {
      // ✅ Always replace whole input with the full track name
      newQuery = keyword;
      setAIquery(newQuery);
      refine(newQuery);

      // ✅ Refine by track name directly (no split)
      trackNameRefine([keyword]);

      // ✅ Highlight only the full track name
      setHighlightedWords([{ word: keyword, attribute }]);
    } else {
      // Replace last word for other attributes
      const words = newQuery.split(/\s+/);
      words[words.length - 1] = keyword;
      newQuery = words.join(" ");
      setAIquery(newQuery);

      // Refine filters for other attributes
      switch (attribute) {
        case "amp_genre_tags":
          genreRefine(keywordsToRefine);
          break;
        case "amp_instrument_tags":
          instrumentRefine(keywordsToRefine);
          break;
        case "tag_key":
          keyRefine(keywordsToRefine);
          break;
        case "tag_tempo":
          tempoRefine(keywordsToRefine);
          break;
        case "tag_library":
          libraryRefine(keywordsToRefine);
          break;
        case "amp_all_mood_tags":
          emotionRefine(keywordsToRefine);
          break;
        // case "track_name":
        //   trackNameRefine(keywordsToRefine);
        //   break;
        default:
          refine(keyword);
          break;
      }

      // Highlight selection
      setHighlightedWords((prev) => [
        ...prev,
        ...keywordsToRefine.map((w) => ({ word: w, attribute })),
      ]);
    }

    setTriggerFetch(false);
    setSuggestions([]);
  };

  const handleTrackSelect = (track) => {
    onTrackSelect(track);
  };
  const clearSpotifySearch = () => {
    // setAIquery("");
    onTrackSelect(null);
  };
  const removeRefinement = (word, attribute) => {
    if (attribute === "ALL") {
      // Reset all refinements
      items.forEach((group) => {
        group.refinements.forEach((ref) => group.refine(ref));
      });
      setHighlightedWords([]);
      refine(""); // reset Algolia
      return;
    }

    const group = items.find((g) => g.attribute === attribute);
    if (!group) return;

    const refinement = group.refinements.find(
      (ref) => ref.label.toLowerCase() === word.toLowerCase()
    );

    if (refinement) {
      group.refine(refinement); // removes Algolia filter
    }

    // Update highlights
    const nextHighlights = highlightedWords.filter(
      (item) =>
        !(
          item.word.toLowerCase() === word.toLowerCase() &&
          item.attribute === attribute
        )
    );

    setHighlightedWords(nextHighlights);

    // 🔥 If no highlights + empty AIquery → reset Algolia
    if (nextHighlights.length === 0 && AIquery.trim() === "") {
      refine(""); // fully reset
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setAIquery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setAiMusicGenerator({ query: value }));
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (AIquery?.length > 10 || selectedFiles.length > 0) {
        e.preventDefault(); // prevent form submit / page refresh
        setSuggestions([]);
        handleUploadVideoBriefToTXt();
      }
    }
  };

  return (
    <div
      className="CustomSearchWithSuggestions"
      style={{ position: "relative" }}
    >
      {selected === "ai" ? (
        <SmartInputBox
          value={AIquery}
          isLoading={isLoading}
          onChange={(e, activeHighlights) => handleChange(e, activeHighlights)}
          highlightedWords={highlightedWords}
          placeholder="Search tracks by name, artist, genre, or vibe (e.g., 'chill jazz')"
          onUnrefine={removeRefinement}
          onKeyDown={handleKeyDown}
          rightButtons={[
            AIquery?.length > 0 && {
              label: "Close",
              icon: <CloseRed />,
              onClick: () => {
                setAIquery("");
                refine("");
                dispatch(
                  setAiMusicGenerator({
                    AIquery: "",
                  })
                );
                stopPolling();
                removeRefinement("", "ALL");
                setBaseFilter();
              },
            },
            (AIquery?.length >= 0 || selectedFiles.length > 0) && {
              label: "Send",
              icon: <IconComponent />,
              disabled: AIquery?.length === 0,
              onClick: (e) => {
                if (AIquery?.length === 0) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }

                setSuggestions([]);
                handleUploadVideoBriefToTXt();
              },
            },
          ]}
        />
      ) : (
        ""
      )}{" "}
      {selected === "similarity" ? (
        <SmartSpotifyInputBox
          value={similQuery == "1" ? "" : similQuery}
          onChange={(e) => {
            setAIquery(e.target.value);
          }}
          placeholder="Find similar tracks—enter a track name, we will search it on Spotify and we’ll suggest matching vibes"
          rightButtons={[
            !isEmpty && {
              label: "Close",
              icon: <CloseRed />,
              onClick: () => {
                if (!isEmpty) {
                  clearSpotifySearch();
                  ontrackClose(1);
                }
                setSearchFieldFlag(true);
              },
            },
            similQuery === "1"
              ? {
                  label: "Send",
                  icon: <Spotify />,
                  onClick: () => {},
                }
              : "",
          ].filter(Boolean)}
          onTrackSelect={handleTrackSelect}
          setIsEmpty={setIsEmpty}
          isEmpty={isEmpty}
          searchFieldFlag={searchFieldFlag}
          setSearchFieldFlag={setSearchFieldFlag}
        />
      ) : (
        ""
      )}
      {suggestions.length > 0 && (
        <div
          className="SearchSuggestionsDropdown"
          ref={suggestionsRef}
          /* style={{
            position: "absolute",
            background: "var(--color-card)",
            zIndex: 999,
            maxHeight: "200px",
            overflowY: "auto",
            fontSize: "1.6rem",
            width: "100%",
            color: "var(--color-white)",
          }} */
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {suggestions.map((sug, idx) => (
              <li
                key={idx}
                style={{ padding: "8px 12px", cursor: "pointer" }}
                onClick={() => handleSuggestionClick(sug)}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: sug.label.replace(
                      /<em>(.*?)<\/em>/g,
                      "<span style='background-color: yellow;'>$1</span>"
                    ),
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSearchBox;
