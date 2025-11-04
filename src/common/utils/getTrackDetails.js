import algoliasearch from "algoliasearch";

async function getTrackDetails(sonichubTrackId = []) {
  try {
    const client = algoliasearch(
      "UGELINWMHK",
      "ca0ae95e4a09ce03c09546001ac1a6d3"
    );
    const index = client.initIndex("tracksData_Search");

    const filter = sonichubTrackId
      ?.map((id) => `sonichub_track_id:"${id}"`)
      .join(" OR ");

    const searchResult = await index.search("", {
      filters: `(${filter}) AND sonichub_track_id > 0`,
      hitsPerPage: 100,
    });

    return searchResult.hits.length > 0 ? searchResult.hits : null;
  } catch (error) {
    console.error("Error while getting track details:", error);
    return null;
  }
}

export default getTrackDetails;
