import getSuperBrandName from "./getSuperBrandName";

const getBrandAlgoliaTags = (prefix) => {
  const {
    REACT_APP_ALGOLIA_INSTRUMENTS_INDEX,
    REACT_APP_ALGOLIA_EMOTIONS_INDEX,
    REACT_APP_ALGOLIA_GENRE_INDEX,
    REACT_APP_ALGOLIA_KEY_INDEX,
    REACT_APP_ALGOLIA_IMPACT_INDEX,
    REACT_APP_ALGOLIA_MOTION_INDEX,
    REACT_APP_ALGOLIA_TONALITY_INDEX,
    REACT_APP_ALGOLIA_FEELINGS_INDEX,
    REACT_APP_ALGOLIA_USED_IN_INDEX,
    //taxonomy
    REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER,
    REACT_APP_ALGOLIA_SONIC_LOGO_MAIN_MOOD_INDEX,
    REACT_APP_ALGOLIA_SONIC_LOGO_MOOD_INDEX,
    REACT_APP_ALGOLIA_AMP_MAIN_MOOD_INDEX,
    REACT_APP_ALGOLIA_AMP_MOOD_INDEX,
  } = process.env;
  const algoliaTags = {};
  if (REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER) {
    algoliaTags.sonicLogoMainMoodIndex = `${prefix}${REACT_APP_ALGOLIA_SONIC_LOGO_MAIN_MOOD_INDEX}`;
    algoliaTags.sonicLogoMoodIndex = `${prefix}${REACT_APP_ALGOLIA_SONIC_LOGO_MOOD_INDEX}`;
    algoliaTags.ampMainMoodIndex = `${prefix}${REACT_APP_ALGOLIA_AMP_MAIN_MOOD_INDEX}`;
    algoliaTags.ampMoodIndex = `${prefix}${REACT_APP_ALGOLIA_AMP_MOOD_INDEX}`;
    algoliaTags.genreIndex = `${prefix}${REACT_APP_ALGOLIA_GENRE_INDEX}`;
    algoliaTags.keyIndex = `${prefix}${REACT_APP_ALGOLIA_KEY_INDEX}`;
  } else {
    algoliaTags.intrumentIndex = `${prefix}${REACT_APP_ALGOLIA_INSTRUMENTS_INDEX}`;
    algoliaTags.emotionIndex = `${prefix}${REACT_APP_ALGOLIA_EMOTIONS_INDEX}`;
    algoliaTags.genreIndex = `${prefix}${REACT_APP_ALGOLIA_GENRE_INDEX}`;
    algoliaTags.keyIndex = `${prefix}${REACT_APP_ALGOLIA_KEY_INDEX}`;
    algoliaTags.impactIndex = `${prefix}${REACT_APP_ALGOLIA_IMPACT_INDEX}`;
    algoliaTags.motionIndex = `${prefix}${REACT_APP_ALGOLIA_MOTION_INDEX}`;
    algoliaTags.tonalityIndex = `${prefix}${REACT_APP_ALGOLIA_TONALITY_INDEX}`;
    algoliaTags.feelingsIndex = `${prefix}${REACT_APP_ALGOLIA_FEELINGS_INDEX}`;
    algoliaTags.usedInIndex = `${prefix}${REACT_APP_ALGOLIA_USED_IN_INDEX}`;
  }
  return algoliaTags;
};

const getAlogilaTags = () => {
  let superBrandName = getSuperBrandName();
  const { REACT_APP_ALGOLIA_TAGS_PREFIX } = process.env;

  let prefix =
    process.env?.[
      `REACT_APP_ALGOLIA_TAGS_PREFIX_${superBrandName.toUpperCase()}`
    ] || REACT_APP_ALGOLIA_TAGS_PREFIX;

  const algoliaTags = getBrandAlgoliaTags(prefix);
  return algoliaTags;
};

export default getAlogilaTags;
