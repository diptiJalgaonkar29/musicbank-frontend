import algoliasearch from "algoliasearch/lite";
import getSuperBrandId from "../../../common/utils/getSuperBrandId";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";
import AsyncService from "../../../networking/services/AsyncService";

const getAlgoliaMoodAndGenreCount = async (config) => {
  const hideMoodTags = window.globalConfig?.HIDE_MOOD_TAGS || [];
  const hideGenreTags = window.globalConfig?.HIDE_GENRE_TAGS || [];

  try {
    const client = algoliasearch(
      "UGELINWMHK",
      "ca0ae95e4a09ce03c09546001ac1a6d3"
    );

    const index = client.initIndex("tracksData_Search");

    // Fetch top downloaded IDs
    const topAlgoliaIdsRes = await AsyncService.loadData(
      "/project/getTopDownloadedTracks"
    );

    const topAlgoliaIds = topAlgoliaIdsRes?.data
      ?.flatMap((item) => item?.objectId || [])
      ?.filter(Boolean);

    if (!topAlgoliaIds.length) {
      return { tag_amp_mainmood_ids: {}, tag_genre: {}, isLoading: false };
    }

    // Build OR filter string
    const filterString = topAlgoliaIds
      .map((id) => `objectID:${id}`)
      .join(" OR ");

    const { hits } = await index.search("", {
      filters: filterString,
      hitsPerPage: topAlgoliaIds.length,
    });

    if (!hits.length) {
      return { tag_amp_mainmood_ids: {}, tag_genre: {}, isLoading: false };
    }

    // ---------- SEPARATE MOOD & GENRE LOGIC ----------
    const moodTagCounts = {};
    const genreTagCounts = {};

    hits.forEach((track) => {
      const moods = track?.amp_all_mood_tags;
      const genres = track?.amp_genre_tags;

      // mood tags
      if (moods?.tag_names && moods?.tag_values) {
        moods.tag_names.forEach((name, i) => {
          const val = moods.tag_values[i] || 0;
          if (!hideMoodTags.includes(name)) {
            if (!moodTagCounts[name]) {
              moodTagCounts[name] = { value: 0, count: 0 };
            }
            moodTagCounts[name].value += val;
            moodTagCounts[name].count += 1;
          }
        });
      }

      // genre tags
      if (genres?.tag_names && genres?.tag_values) {
        genres.tag_names.forEach((name, i) => {
          const val = genres.tag_values[i] || 0;
          if (!hideGenreTags.includes(name)) {
            if (!genreTagCounts[name]) {
              genreTagCounts[name] = { value: 0, count: 0 };
            }
            genreTagCounts[name].value += val;
            genreTagCounts[name].count += 1;
          }
        });
      }
    });

    // Convert objects → sorted arrays
    const finalSummedMoodTags = Object.entries(moodTagCounts)
      .map(([name, { value, count }]) => ({ name, value, count }))
      .sort((a, b) => b.value - a.value);

    const finalSummedGenreTags = Object.entries(genreTagCounts)
      .map(([name, { value, count }]) => ({ name, value, count }))
      .sort((a, b) => b.value - a.value);

    // --- SUM VALUES ---
    const moodTotalValue = finalSummedMoodTags.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const genreTotalValue = finalSummedGenreTags.reduce(
      (sum, item) => sum + item.value,
      0
    );

    const extractTop3Tags = (hits) => {
      return hits.map((hit) => {
        const genre = hit.amp_genre_tags || {};
        const Mood = hit.amp_all_mood_tags || {};

        // convert into array of objects: [{name, value}, ...]
        const genreList = (genre.tag_names || []).map((name, i) => ({
          name,
          value: Number(genre.tag_values[i]) || 0,
        }));

        const instrumentList = (Mood.tag_names || []).map((name, i) => ({
          name,
          value: Mood.tag_values[i] || 0,
        }));

        // sort + slice top 3
        const topGenre = genreList
          .sort((a, b) => b.value - a.value)
          .slice(0, 3);
        const topMood = instrumentList
          .sort((a, b) => b.value - a.value)
          .slice(0, 3);

        return {
          objectID: hit.objectID,
          topGenre,
          topMood,
        };
      });
    };
    console.log(extractTop3Tags(hits), "extractTop3Tags");

    console.log("Mood Tags Total Value:", moodTotalValue);
    console.log("Genre Tags Total Value:", genreTotalValue);

    console.log("#finalSummedMoodTags", finalSummedMoodTags);
    console.log("#finalSummedGenreTags", finalSummedGenreTags);

    // ---------- TOP 4 + OTHER ----------
    const processTop4WithOther = (tagArray) => {
      const sorted = tagArray.sort((a, b) => b.value - a.value);

      const top4 = sorted.slice(0, 4);
      const remaining = sorted.slice(4);

      const otherTotal = remaining.reduce((sum, t) => sum + t.value, 0);

      const result = Object.fromEntries(top4.map((t) => [t.name, t.value]));
      if (otherTotal > 0) result["Other"] = otherTotal;

      return result;
    };

    return {
      tag_amp_mainmood_ids: processTop4WithOther(finalSummedMoodTags),
      tag_genre: processTop4WithOther(finalSummedGenreTags),
      isLoading: false,
    };
  } catch (error) {
    console.error("Algolia fetch error:", error);
    return { tag_amp_mainmood_ids: {}, tag_genre: {}, isLoading: false };
  }
};

export default getAlgoliaMoodAndGenreCount;
