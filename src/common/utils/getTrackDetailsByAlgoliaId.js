import algoliasearch from "algoliasearch";

async function getTrackDetailsByAlgoliaId(algoliaIds = []) {
  if (!Array.isArray(algoliaIds) || algoliaIds.length === 0) {
    console.warn("getTrackDetailsByAlgoliaId called with empty array");
    return null;
  }

  try {
    const client = algoliasearch(
      "UGELINWMHK",
      "ca0ae95e4a09ce03c09546001ac1a6d3"
    );
    const index = client.initIndex("tracksData_Search");

    // Build Algolia filters for objectIDs
    const filter = algoliaIds.map((id) => `objectID:"${id}"`).join(" OR ");

    const searchResult = await index.search("", {
      filters: `(${filter})`,
      hitsPerPage: 100,
    });

    return searchResult?.hits?.length ? searchResult.hits : null;
  } catch (error) {
    console.error("Error while getting track details by Algolia ID:", error);
    return null;
  }
}

export default getTrackDetailsByAlgoliaId;
