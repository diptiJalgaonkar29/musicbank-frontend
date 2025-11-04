import algoliasearch from "algoliasearch/lite"; // Import the Algolia client

const AlgoliaTagMasters = ({ indexname }) => {
  const ALGOLIA_APP_ID = "UGELINWMHK"; // Your Algolia Application ID
  const ALGOLIA_SEARCH_KEY = "ca0ae95e4a09ce03c09546001ac1a6d3"; // Your Algolia Search Key

  // Initialize the Algolia client
  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
  const index = client.initIndex(indexname); // Initialize the index with the given name

  // Fetch data from Algolia and return it as a Promise
  return index
    .search("", { hitsPerPage: 100 }) // Search for all records, you can customize query or filtering
    .then((response) => response?.hits || [])
    .catch((err) => {
      console.error("Error fetching data from Algolia:", err);
      throw err; // Re-throw the error to be handled by the caller
    });
};

export default AlgoliaTagMasters;
