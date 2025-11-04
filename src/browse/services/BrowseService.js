import trackExternalAPICalls from "../../common/services/trackExternalAPICalls";
import DateUtils from "../../common/utils/DateUtils";
import getConfigJson from "../../common/utils/getConfigJson";
import AlgoliaService from "../../networking/services/AlgoliaService";
import AsynchService from "../../networking/services/AsyncService";

const HITS_PER_PAGE = 12;
const ALGOLIA_ATTRIBUTES = [
  "preview_image_url",
  "track_name",
  "created_at",
  "created_at_timestamp",
];

class BrowseService {
  constructor(asynchService, algoliaService) {
    this.asynchService = asynchService;
    this.algoliaService = algoliaService;
  }

  loadRecentlyAdded() {
    return this.algoliaService
      .browseRecentlyAdded({
        query: "",
        hitsPerPage: HITS_PER_PAGE,
        attributesToRetrieve: ALGOLIA_ATTRIBUTES,
        filters: `trackStatus:true AND trackActive:true`,
      })
      .then((res) => {
        trackExternalAPICalls({
          url: "",
          requestData: JSON.stringify({
            query: "",
            hitsPerPage: HITS_PER_PAGE,
            attributesToRetrieve: ALGOLIA_ATTRIBUTES,
            filters: `trackStatus:true AND trackActive:true`,
          }),
          usedFor: "browseRecentlyAdded",
          serviceBy: "Algolia",
          statusCode: 200,
          statusMessage: "",
        });
        return res.hits.map(
          (hit) =>
            new BrowseTrack(
              hit.objectID,
              hit.preview_image_url,
              hit.track_name,
              DateUtils.toSimpleString(hit.created_at)
            )
        );
      })
      .catch((error) => {
        console.log("browseRecentlyAdded error", error);
        trackExternalAPICalls({
          url: "",
          requestData: JSON.stringify({
            query: "",
            hitsPerPage: HITS_PER_PAGE,
            attributesToRetrieve: ALGOLIA_ATTRIBUTES,
            filters: `trackStatus:true AND trackActive:true`,
          }),
          usedFor: "browseRecentlyAdded",
          serviceBy: "Algolia",
          statusCode: error?.statusCode || "404",
          statusMessage: error?.message,
        });
      });
  }

  loadPopular() {
    //https://mb.ampsoundbranding.com/api/statistics/downloads/totals
    //http://localhost:3000/api/statistics/downloads/totals

    return this.asynchService
      .loadData("/statistics/downloads/totals")
      .then((res) => {
        const ids = res.data
          .slice(0, HITS_PER_PAGE)
          .map((item) => item.track_id.toString());
        return this.algoliaService
          .getObjects(ids, ALGOLIA_ATTRIBUTES)
          .then(() => {
            trackExternalAPICalls({
              url: "",
              requestData: JSON.stringify({
                ids,
                ALGOLIA_ATTRIBUTES: ALGOLIA_ATTRIBUTES,
              }),
              usedFor: "getObjects",
              serviceBy: "Algolia",
              statusCode: 200,
              statusMessage: "",
            });
          })
          .catch((error) => {
            console.log("getObjects error", error);
            trackExternalAPICalls({
              url: "",
              requestData: JSON.stringify({
                ids,
                ALGOLIA_ATTRIBUTES: ALGOLIA_ATTRIBUTES,
              }),
              usedFor: "getObjects",
              serviceBy: "Algolia",
              statusCode: error?.statusCode || "404",
              statusMessage: error?.message,
            });
          });
      })
      .then((res) => {
        return res.results
          .filter((hit) => hit !== null)
          .map(
            (hit) =>
              new BrowseTrack(
                hit.objectID,
                hit.preview_image_url,
                hit.track_name,
                null
              )
          );
      });
  }

  loadCurated() {
    return this.asynchService
      .loadData(`/playlist2050/curatorPlaylist`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
}

class BrowseTrack {
  constructor(id, image, title, subtitle) {
    this.id = id;
    this.image = image;
    this.title = title;
    this.subtitle = subtitle;
  }
}

export default new BrowseService(AsynchService, AlgoliaService);
