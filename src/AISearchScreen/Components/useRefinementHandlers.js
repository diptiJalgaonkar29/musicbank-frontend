// hooks/useRefinementHandlers.js
import { useRefinementList } from "react-instantsearch";
import { useCallback, useMemo } from "react";
import getAmpMoodTagLabel from "../../common/utils/getAmpMoodTagLabel";
import getInstrumentsLabel from "../../common/utils/getInstrumentsLabel";
import getAssetTypeLabel from "../../common/utils/getAssetTypeLabel";
// import getBrandLabel from "../../common/utils/getBrandLabel";

export function useRefinementHandlers() {
  // -----------------------------
  // Individual refine functions
  // -----------------------------
  const { refine: tempoRefine } = useRefinementList({
    attribute: "tag_tempo",
    operator: "and",
  });

  const { refine: emotionRefine } = useRefinementList({
    attribute: "amp_all_mood_tags.tag_names",
    operator: "and",
  });

  const { refine: trackNameRefine } = useRefinementList({
    attribute: "track_name",
    operator: "and",
  });

  const { refine: instrumentRefine } = useRefinementList({
    attribute: "amp_instrument_tags.tag_names",
    operator: "and",
  });

  const { refine: keyRefine } = useRefinementList({
    attribute: "tag_key",
    operator: "and",
  });

  const { refine: genreRefine } = useRefinementList({
    attribute: "amp_genre_tags.tag_names",
    operator: "and",
  });

  const { refine: assetRefine } = useRefinementList({
    attribute: "asset_type_id",
  });

  // const { refine: brandRefine } = useRefinementList({ attribute: "brands_assigned" });

  const { refine: libraryRefine } = useRefinementList({
    attribute: "track_type_id",
    operator: "or",
  });

  // -----------------------------
  // Stable sorting function
  // -----------------------------

  // Stable transform function to sort alphabetically but keep selected on top
  const hideMoodTags = useMemo(
    () =>
      (window.globalConfig?.HIDE_MOOD_TAGS || []).map((tag) =>
        tag.toLowerCase()
      ),
    []
  );

  const hideGenreTags = useMemo(
    () =>
      (window.globalConfig?.HIDE_GENRE_TAGS || []).map((tag) =>
        tag.toLowerCase()
      ),
    []
  );

  const transformItemsSorted = useCallback((items) => {
    return [...items]
      .sort((a, b) => a.label.localeCompare(b.label)) // alphabetical
      .sort((a, b) => (b.isRefined ? 1 : 0) - (a.isRefined ? 1 : 0)); // selected on top
  }, []);

  // -----------------------------
  // Filters for Sidebar (with sorting)
  // -----------------------------
  const emotionFilter = useRefinementList({
    attribute: "amp_all_mood_tags.tag_names",
    searchable: false,
    showMore: true,
    limit: 10,
    showMoreLimit: 500,
    operator: "and",
    transformItems: useCallback(
      (items) =>
        transformItemsSorted(
          items.filter(
            (item) => !hideMoodTags.includes(item.label.toLowerCase())
          )
        ),
      [transformItemsSorted, hideMoodTags]
    ),
  });

  const instrumentFilter = useRefinementList({
    attribute: "amp_instrument_tags.tag_names",
    searchable: false,
    showMore: true,
    limit: 10,
    showMoreLimit: 500,
    operator: "and",
    transformItems: transformItemsSorted,
  });

  const keyFilter = useRefinementList({
    attribute: "tag_key",
    searchable: true,
    showMore: true,
    limit: 10,
    showMoreLimit: 500,
    operator: "and",
    transformItems: transformItemsSorted,
  });

  const genreFilter = useRefinementList({
    attribute: "amp_genre_tags.tag_names",
    searchable: true,
    showMore: true,
    limit: 10,
    showMoreLimit: 500,
    operator: "and",
    transformItems: useCallback(
      (items) =>
        transformItemsSorted(
          items.filter(
            (item) => !hideGenreTags.includes(item.label.toLowerCase())
          )
        ),
      [transformItemsSorted, hideGenreTags]
    ),
  });

  const assetTypeFilter = useRefinementList({
    attribute: "asset_type_id",
    searchable: false,
    showMore: true,
    limit: 10,
    showMoreLimit: 500,
    operator: "and",
    transformItems: transformItemsSorted,
  });

  const stemsFilter = useRefinementList({
    attribute: "track_mediatypes",
    searchable: false,
    showMore: true,
    limit: 10,
    showMoreLimit: 500,
    operator: "and",
    transformItems: transformItemsSorted,
  });

  const brandFilter = useRefinementList({
    attribute: "brands_assigned",
    searchable: false,
    showMore: true,
    limit: 10,
    showMoreLimit: 500,
  });

  const tempoFilter = useRefinementList({
    attribute: "tag_tempo",
    searchable: true,
    showMore: true,
    limit: 10,
    showMoreLimit: 100,
    operator: "and",
    transformItems: transformItemsSorted,
  });

  const libraryFilter = useRefinementList({
    attribute: "track_type_id",
    searchable: true,
    showMore: true,
    limit: 10,
    showMoreLimit: 100,
    operator: "or",
    transformItems: transformItemsSorted,
  });

  // 🔥 Event & Moment filters
  const eventTagsFilter = useRefinementList({
    attribute: "event_tags.tag_names",
    searchable: false,
    showMore: true,
    limit: 10,
    showMoreLimit: 500,
    operator: "and",
    transformItems: transformItemsSorted,
  });

  const momentTagsFilter = useRefinementList({
    attribute: "moment_tags.tag_names",
    searchable: false,
    showMore: true,
    limit: 10,
    showMoreLimit: 500,
    operator: "and",
    transformItems: transformItemsSorted,
  });

  // -----------------------------
  // Filter sidebar configs
  // -----------------------------
  const filterConfigs = [
    {
      label: "Musical Feel",
      labelGetter: getAmpMoodTagLabel,
      attribute: "amp_all_mood_tags.tag_names",
      ...emotionFilter,
    },
    {
      label: "Instruments",
      labelGetter: getInstrumentsLabel,
      attribute: "amp_instrument_tags.tag_names",
      ...instrumentFilter,
    },
    {
      label: "Key",
      labelGetter: (val) => val,
      attribute: "tag_key",
      ...keyFilter,
    },
    {
      label: "Genre",
      labelGetter: (val) => val,
      attribute: "amp_genre_tags.tag_names",
      ...genreFilter,
    },
    {
      label: "Asset Type",
      labelGetter: getAssetTypeLabel,
      attribute: "asset_type_id",
      hideSearch: true,
      ...assetTypeFilter,
    },
    {
      label: "Stems",
      labelGetter: (val) => val,
      attribute: "track_mediatypes",
      hideSearch: true,
      ...stemsFilter,
    },
    // { label: "Brand", labelGetter: getBrandLabel, attribute: "brands_assigned", ...brandFilter },
  ];

  // -----------------------------
  // Refine by attribute mapping
  // -----------------------------
  const refineByAttribute = {
    tag_genre: genreRefine,
    instrument_ids: instrumentRefine,
    tag_key: keyRefine,
    tag_tempo: tempoRefine,
    asset_type_id: assetRefine,
    // brands_assigned: brandRefine,
    track_type_id: libraryRefine,
    tag_amp_allmood_ids: emotionRefine,
  };

  return {
    // refine functions
    genreRefine,
    instrumentRefine,
    keyRefine,
    tempoRefine,
    libraryRefine,
    assetRefine,
    // brandRefine,
    emotionRefine,
    trackNameRefine,

    // filters
    tempoFilter,
    filterConfigs,

    // new event/moment filters
    eventTagsFilter,
    momentTagsFilter,

    // mapping
    refineByAttribute,
  };
}
