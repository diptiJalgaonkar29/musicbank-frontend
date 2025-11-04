import AlgoliaService from "../../networking/services/AlgoliaService";

class LatestTracksService {
  constructor(algoliaService) {
    this.algoliaService = algoliaService;
  }

  getLatest(amount) {
    return this.algoliaService
      .search({
        query: " ",
        attributesToRetrieve: [
          "tag_genre",
          "preview_image_url",
          "track_name",
          "tag_all",
          "objectID",
          "created_at",
          "-_highlightResult",
        ],
        hitsPerPage: amount,
      })
      .then((res) => {
        res.hits;
        trackExternalAPICalls({
          url: "",
          requestData: JSON.stringify({
            query: " ",
            attributesToRetrieve: [
              "tag_genre",
              "preview_image_url",
              "track_name",
              "tag_all",
              "objectID",
              "created_at",
              "-_highlightResult",
            ],
            hitsPerPage: amount,
          }),
          usedFor: "search",
          serviceBy: "Algolia",
          statusCode: 200,
          statusMessage: "",
        });
      })
      .catch((error) => {
        console.error("Search error", error);
        trackExternalAPICalls({
          url: "",
          requestData: JSON.stringify({
            query: " ",
            attributesToRetrieve: [
              "tag_genre",
              "preview_image_url",
              "track_name",
              "tag_all",
              "objectID",
              "created_at",
              "-_highlightResult",
            ],
            hitsPerPage: amount,
          }),
          usedFor: "search",
          serviceBy: "Algolia",
          statusCode: error?.statusCode || "404",
          statusMessage: error?.message,
        });
      });
  }
}

export default new LatestTracksService(AlgoliaService);
