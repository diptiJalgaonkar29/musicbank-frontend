import * as algoliasearch from "algoliasearch";
import getAlogilaMeta from "../../common/utils/getAlogilaMeta";

var client = algoliasearch(getAlogilaMeta()?.appID, getAlogilaMeta()?.token);
var algoliaClient = client.initIndex(getAlogilaMeta()?.index);
var algoliaClientRecentlyAdded = client.initIndex(
  getAlogilaMeta()?.recentAddedIndex
);

class AlgoliaService {
  constructor(algoliaSearch, algoliaClientRecentyAdded) {
    this.algoliaSearch = algoliaSearch;
    this.algoliaClientRecentyAdded = algoliaClientRecentyAdded;
  }

  search(options) {
    return this.algoliaSearch.search(options);
  }

  browseRecentlyAdded(options) {
    return this.algoliaClientRecentyAdded.search(options);
  }

  getObjects(objectIds, options) {
    return this.algoliaSearch.getObjects(objectIds, options);
  }

  getObject(objectId, options) {
    return this.algoliaSearch.getObject(objectId, options);
  }

  getClient() {
    return this.algoliaSearch;
  }
}

export default new AlgoliaService(algoliaClient, algoliaClientRecentlyAdded);
