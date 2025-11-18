import algoliasearch from "algoliasearch/lite";
import getSuperBrandId from "../../../common/utils/getSuperBrandId";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";
import AsyncService from "../../../networking/services/AsyncService";

const getAlgoliaMoodAndGenreCount = async (config) => {
  // config must be passed from component where BrandingContext is available

  const hideMoodTags = window.globalConfig?.HIDE_MOOD_TAGS || [];
  const hideGenreTags = window.globalConfig?.HIDE_GENRE_TAGS || [];

  console.log("hideMoodTags", hideMoodTags);
  console.log("hideGenreTags", hideGenreTags);

  try {
    const client = algoliasearch(
      "UGELINWMHK",
      "ca0ae95e4a09ce03c09546001ac1a6d3"
    );

    const index = client.initIndex("tracksData_Search");

    const brandId = config?.brandId || localStorage.getItem("brandId");

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
    const { hits } = await index.search("", {
      hitsPerPage: 50,
      filters: baseFilter,
    });

    console.log("Algolia hits:", hits);

    if (!hits.length) {
      return { tag_amp_mainmood_ids: {}, tag_genre: {}, isLoading: false };
    }

    const moodCounts = {};
    const genreCounts = {};

    hits.forEach((track) => {
      const moods = track?.amp_all_mood_tags;
      const genres = track?.amp_genre_tags;

      if (moods?.tag_names && moods?.tag_values) {
        moods.tag_names.forEach((name, i) => {
          if (!hideMoodTags.includes(name)) {
            moodCounts[name] =
              (moodCounts[name] || 0) + (moods.tag_values[i] || 0);
          }
        });
      }

      if (genres?.tag_names && genres?.tag_values) {
        genres.tag_names.forEach((name, i) => {
          if (!hideGenreTags.includes(name)) {
            genreCounts[name] =
              (genreCounts[name] || 0) + (genres.tag_values[i] || 0);
          }
        });
      }
    });

    const processTop5 = (counts) =>
      Object.fromEntries(
        Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
      );

    return {
      tag_amp_mainmood_ids: processTop5(moodCounts),
      tag_genre: processTop5(genreCounts),
      isLoading: false,
    };
  } catch (error) {
    console.error("Algolia fetch error:", error);
    return { tag_amp_mainmood_ids: {}, tag_genre: {}, isLoading: false };
  }
};

export default getAlgoliaMoodAndGenreCount;
