import getSuperBrandName from "./getSuperBrandName";

const getAlogilaMeta = () => {
  let superBrandName = getSuperBrandName();
  const {
    REACT_APP_ALGOLIA_APP_ID,
    REACT_APP_ALGOLIA_PUBLIC_TOKEN,
    REACT_APP_ALGOLIA_TAGS_PREFIX,

    REACT_APP_ALGOLIA_SONGS_INDEX,
    REACT_APP_ALGOLIA_SONGS_SEARCH_INDEX,
    REACT_APP_ALGOLIA_SONGS_SORTED_BY_RECENTLY_ADDED_INDEX,
  } = process.env;
  let algoliaMeta = {};
  let prefix;
  algoliaMeta.appID =
    process.env?.[`REACT_APP_ALGOLIA_APP_ID_${superBrandName.toUpperCase()}`] ||
    REACT_APP_ALGOLIA_APP_ID;
  algoliaMeta.token =
    process.env?.[
      `REACT_APP_ALGOLIA_PUBLIC_TOKEN_${superBrandName.toUpperCase()}`
    ] || REACT_APP_ALGOLIA_PUBLIC_TOKEN;
  prefix =
    process.env?.[
      `REACT_APP_ALGOLIA_TAGS_PREFIX_${superBrandName.toUpperCase()}`
    ] || REACT_APP_ALGOLIA_TAGS_PREFIX;
  algoliaMeta.index = `${prefix}${REACT_APP_ALGOLIA_SONGS_INDEX}`;
  algoliaMeta.trackNameSearchIndex = `${prefix}${REACT_APP_ALGOLIA_SONGS_SEARCH_INDEX}`;
  algoliaMeta.recentAddedIndex = `${prefix}${REACT_APP_ALGOLIA_SONGS_SORTED_BY_RECENTLY_ADDED_INDEX}`;
  return algoliaMeta;
};

export default getAlogilaMeta;
