import _ from "lodash";
import React, { useRef, useState } from "react";
import { connectAutoComplete } from "react-instantsearch-dom";
import trackExternalAPICalls from "../../common/services/trackExternalAPICalls";

const Autocomplete = ({ currentRefinement, refine, setShowDropDown }) => {
  const sendQuery = (query) => {
    // console.log(`Querying for ${query}`);
    refine(query);
    trackExternalAPICalls({
      url: "",
      requestData: JSON.stringify({
        query,
      }),
      usedFor: "similaritySearch",
      serviceBy: "Algolia",
      statusCode: 200,
      statusMessage: "",
    });
  };
  const [userQuery, setUserQuery] = useState("");
  const delayedQuery = useRef(_.debounce((q) => sendQuery(q), 500)).current;
  const onChange = (e) => {
    setUserQuery(e.target.value);
    delayedQuery(e.target.value);
  };

  return (
    <div className="st-inner">
      <input
        type="text"
        className="st-input-search librarySearchInput"
        placeholder="Search for a track in Library"
        // value={currentRefinement}
        value={userQuery}
        onFocus={() => {
          setShowDropDown(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setShowDropDown(false);
          }, 250);
        }}
        onChange={(event) => {
          onChange(event);
          // refine(event.target.value);
        }}
      />
    </div>
  );
};

export const CustomAutocomplete = connectAutoComplete(Autocomplete);

// import _ from "lodash";
// import React, { useRef, useState } from "react";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import SearchResultsCard from "./searchResultsCard/SearchResultsCard";
// import AlgoliaService from "../../networking/services/AlgoliaService";
// import trackExternalAPICalls from "../../common/services/trackExternalAPICalls";
// import "./AlgoSearch.css";

// const Autocomplete1 = ({ currentRefinement, refine, isDataSelected }) => {
//   console.log("isDataSelected", isDataSelected);
//   const [userQuery, setUserQuery] = useState("");
//   const [allTracks, setAllTracks] = useState([]);
//   const delayedQuery = useRef(_.debounce((q) => sendQuery(q), 500)).current;
//   const onChange = (e) => {
//     setUserQuery(e.target.value);
//     delayedQuery(e.target.value);
//   };

//   const sendQuery = (query) => {
//     console.log(`Querying for ${query}`);
//     // refine(query);
//     if (query.length >= 2 && allTracks?.length === 0) {
//       console.log("loadAllAlgoliaTracks called");
//       loadAllAlgoliaTracks();
//     }
//   };

//   const loadAllAlgoliaTracks = () => {
//     AlgoliaService.search(
//       {
//         query: " ",
//         filters: `trackStatus:true AND cyanite_id > 0`,
//         attributesToRetrieve: [
//           "objectID",
//           "cyanite_id",
//           "track_name",
//           "preview_image_url",
//           "trackStatus",
//         ],
//       }

//       // "", {
//       // filters: `trackStatus:true`,
//       // }
//     )
//       .then(({ hits }) => {
//         setAllTracks(hits);
//         trackExternalAPICalls({
//           url: "",
//           requestData: JSON.stringify({
//             filters: `trackStatus:true`,
//           }),
//           usedFor: "search",
//           serviceBy: "Algolia",
//           statusCode: 200,
//           statusMessage: "",
//         });
//       })
//       .catch((error) => {
//         console.log("Search error", error);
//         trackExternalAPICalls({
//           url: "",
//           requestData: JSON.stringify({
//             filters: `trackStatus:true`,
//           }),
//           usedFor: "search",
//           serviceBy: "Algolia",
//           statusCode: error?.statusCode || "404",
//           statusMessage: error?.message,
//         });
//       });
//   };
//   return (
//     <div className="st-inner">
//       <Autocomplete
//         id="aloglia_ss_search"
//         options={allTracks}
//         style={{ width: "100%" }}
//         // className="ss_library_input"
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             // label="Search for a track in library"
//             variant="standard"
//             className="st-input-search librarySearchInput"
//             placeholder="Search for a track in library"
//             // value={currentRefinement}
//             value={userQuery}
//             onChange={(event) => {
//               onChange(event);
//               // refine(event.target.value);
//             }}
//           />
//           // <input
//           //   {...params}
//           //   type="text"
//           //   className="st-input-search librarySearchInput"
//           //   placeholder="Search for a track in library"
//           //   // value={currentRefinement}
//           //   value={userQuery}
//           //   onChange={(event) => {
//           //     onChange(event);
//           //     // refine(event.target.value);
//           //   }}
//           // />
//         )}
//         getOptionLabel={(option) => {
//           // Value selected with enter, right from the input
//           if (typeof option === "string") {
//             return option;
//           }
//           // Add "xxx" option created dynamically
//           if (option.inputValue) {
//             return option.inputValue;
//           }
//           // Regular option
//           return option.track_name;
//         }}
//         renderOption={(props, option) => (
//           <li {...props}>
//             <SearchResultsCard
//               data_type="library"
//               track_name={props.track_name}
//               preview_image_url={props.preview_image_url}
//             />
//           </li>
//         )}
//       />
//     </div>
//   );
// };

// export default Autocomplete1;
