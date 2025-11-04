//import getAllTagMaster from "../../cyanite/services/getAllTagMaster";
// import AsyncService from "../../networking/services/AsyncService";
// import {
//   addAmpMainMoodTagsIdAndLabelObj,
//   addAmpMoodTagsIdAndLabelObj,
//   addAssetTypeIdAndLabelObj,
//   addInstrumentsIdAndLabelObj,
//   addLibraryIdAndLabelObj,
//   addSonicLogoMainMoodTagsIdAndLabelObj,
//   addSonicLogoMoodTagsIdAndLabelObj,
// } from "../../redux/actions/taxonomyActions/taxonomyActions";
// import { store } from "../../redux/stores/store";

// const loadTaxonomyTags = () => {
//   if (!process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER) return;
//   // console.log("loadTaxonomyTags called");

//   const ASSET_TYPE_MASTER = 1;
//   getAllTagMaster({
//     masterId: ASSET_TYPE_MASTER,
//     onSuccess: (responseTags) => {
//       let assetTypeIdAndLabelObj = responseTags?.data?.reduce(
//         (prev, current) => {
//           return { ...prev, [current.tagId]: current.alternateTagName };
//         },
//         {}
//       );
//       store.dispatch(addAssetTypeIdAndLabelObj(assetTypeIdAndLabelObj));
//     },
//   });

//   const AMP_MOOD_TAG_MASTER = 2;
//   getAllTagMaster({
//     masterId: AMP_MOOD_TAG_MASTER,
//     onSuccess: (responseTags) => {
//       let ampMoodTagsIdAndLabelObj = responseTags?.data?.reduce(
//         (prev, current) => {
//           return { ...prev, [current.tagId]: current.alternateTagName };
//         },
//         {}
//       );
//       store.dispatch(addAmpMoodTagsIdAndLabelObj(ampMoodTagsIdAndLabelObj));
//     },
//   });

//   const AMP_MAIN_MOOD_TAG_MASTER = 3;
//   getAllTagMaster({
//     masterId: AMP_MAIN_MOOD_TAG_MASTER,
//     onSuccess: (responseTags) => {
//       let ampMainMoodTagsIdAndLabelObj = responseTags?.data?.reduce(
//         (prev, current) => {
//           return { ...prev, [current.tagId]: current.alternateTagName };
//         },
//         {}
//       );
//       store.dispatch(
//         addAmpMainMoodTagsIdAndLabelObj(ampMainMoodTagsIdAndLabelObj)
//       );
//     },
//   });

//   const SONIC_LOGO_MOOD_TAG_MASTER = 4;
//   getAllTagMaster({
//     masterId: SONIC_LOGO_MOOD_TAG_MASTER,
//     onSuccess: (responseTags) => {
//       let sonicLogoMoodTagsIdAndLabelObj = responseTags?.data?.reduce(
//         (prev, current) => {
//           return { ...prev, [current.tagId]: current.alternateTagName };
//         },
//         {}
//       );
//       store.dispatch(
//         addSonicLogoMoodTagsIdAndLabelObj(sonicLogoMoodTagsIdAndLabelObj)
//       );
//     },
//   });

//   const SONIC_LOGO_MAIN_MOOD_TAG_MASTER = 5;
//   getAllTagMaster({
//     masterId: SONIC_LOGO_MAIN_MOOD_TAG_MASTER,
//     onSuccess: (responseTags) => {
//       let sonicLogoMainMoodTagsIdAndLabelObj = responseTags?.data?.reduce(
//         (prev, current) => {
//           return { ...prev, [current.tagId]: current.alternateTagName };
//         },
//         {}
//       );
//       store.dispatch(
//         addSonicLogoMainMoodTagsIdAndLabelObj(
//           sonicLogoMainMoodTagsIdAndLabelObj
//         )
//       );
//     },
//   });

//   const INSTRUMENTS_MASTER = 6;
//   getAllTagMaster({
//     masterId: INSTRUMENTS_MASTER,
//     onSuccess: (responseTags) => {
//       let instrumentsIdAndLabelObj = responseTags?.data?.reduce(
//         (prev, current) => {
//           return {
//             ...prev,
//             [current.instrumentId]: current.alternateInstrumentName,
//           };
//         },
//         {}
//       );
//       store.dispatch(addInstrumentsIdAndLabelObj(instrumentsIdAndLabelObj));
//     },
//   });
//   //const LIBRARY_TYPE_MASTER = 7;
//   const fetchMusicLibrary = async () => {
//     try {
//       const response = await AsyncService.loadData(
//         "trackType/getAllTrackTypes"
//       );
//       let libraryIdAndLabelObj = response?.data?.reduce((prev, current) => {
//         return {
//           ...prev,
//           [current.id]: current.trackType,
//         };
//       }, {});
//       store.dispatch(addLibraryIdAndLabelObj(libraryIdAndLabelObj));
//     } catch (error) {
//       console.error("Failed to load music library:", error);
//     }
//   };
// };
// export default loadTaxonomyTags;

import AlgoliaTagMasters from "../../AISearchScreen/Components/AlgoliaTagMasters/AlgoliaTagMasters";
import getAllTagMaster from "../../cyanite/services/getAllTagMaster";
import {
  addAssetTypeIdAndLabelObj,
  addTrackTypeIdAndLabelObj,
  addAmpMoodTagsIdAndLabelObj,
} from "../../redux/actions/taxonomyActions/taxonomyActions";
import { store } from "../../redux/stores/store";

const loadTaxonomyTags = () => {
  // if (!process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER) return;
  // // console.log("loadTaxonomyTags called");

  AlgoliaTagMasters({ indexname: "assettype" })
    .then((responseTags) => {
      // Process the response data and map it to the required format
      let assetTypeIdAndLabelObj = responseTags.reduce((prev, current) => {
        return { ...prev, [current.tag_name]: current.name }; // Assuming `tag_name` and `name` are the properties
      }, {});

      // Dispatch the action to Redux store
      store.dispatch(addAssetTypeIdAndLabelObj(assetTypeIdAndLabelObj));

      // Optional: Call any additional success handler if necessary
    })
    .catch((err) => {
      // Handle error if something goes wrong with the request
      console.error("Error:", err);
    });
  AlgoliaTagMasters({ indexname: "tracktype" })
    .then((responseTags) => {
      // Process the response data and map it to the required format
      let trackTypeIdAndLabelObj = responseTags.reduce((prev, current) => {
        return { ...prev, [current.id]: current.name }; // Assuming `tag_name` and `name` are the properties
      }, {});

      console.log("trackTypeIdAndLabelObj", trackTypeIdAndLabelObj);
      // Dispatch the action to Redux store
      store.dispatch(addTrackTypeIdAndLabelObj(trackTypeIdAndLabelObj));

      // Optional: Call any additional success handler if necessary
    })
    .catch((err) => {
      // Handle error if something goes wrong with the request
      console.error("Error:", err);
    });
  const AMP_MOOD_TAG_MASTER = 2;
  getAllTagMaster({
    masterId: AMP_MOOD_TAG_MASTER,
    onSuccess: (responseTags) => {
      let ampMoodTagsIdAndLabelObj = responseTags?.data?.reduce(
        (prev, current) => {
          return { ...prev, [current.tagId]: current.alternateTagName };
        },
        {}
      );
      store.dispatch(addAmpMoodTagsIdAndLabelObj(ampMoodTagsIdAndLabelObj));
    },
  });
};
export default loadTaxonomyTags;
