import AsyncService from "../../networking/services/AsyncService";
import { NetworkingError } from "../../common/model/NetworkingError";
import getTrackDetails from "../../common/utils/getTrackDetails";
import getTrackDetailsByAlgoliaId from "../../common/utils/getTrackDetailsByAlgoliaId";

class PlaylistService {
  constructor(asyncService) {
    this.asyncService = asyncService;
  }

  getAll() {
    return this.asyncService
      .loadData("/playlist2050")
      .then((response) => {
        return response.data;
      })
      .catch(() => {
        throw new NetworkingError("Failed loading Playlists!");
      });
  }

  getById(id) {
    return this.asyncService
      .loadData(`/playlist2050/${id}`)
      .then((response) => {
        return response.data;
      })
      .catch(() => {
        throw new NetworkingError(`Failed loading Playlist ${id}!`);
      });
  }

  async getLinkValidity(_validateFor) {
    const headerJSON = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic cmVzdC1jbGllbnQ6cmVzdC1jbGllbnQtc2VjcmV0",
      },
    };

    try {
      const response = await this.asyncService.loadDataParam(
        "/playlist2050/playlistMcodeDetails",
        _validateFor,
        headerJSON
      );

      const data = response.data;

      if (data?.constructor === Object && Object.entries(data).length === 0) {
        return;
      }

      // --- Step 1: Extract Track IDs ---
      const missingAlgoliaIdTracks =
        data?.tracks?.filter(
          (track) => !track?.algoliaId && track?.objectID > 0
        ) || [];

      const memoizedIds = missingAlgoliaIdTracks.map((track) => track.objectID);

      const algoliaIdTracks =
        data?.tracks?.filter((track) => !!track?.algoliaId) || [];

      const memoizedAlgoliaIds = algoliaIdTracks.map(
        (track) => track.algoliaId
      );

      if (memoizedIds.length > 0 || memoizedAlgoliaIds.length > 0) {
        try {
          // --- Step 2: Fetch Algolia details ---
          const [algoliaResponseByTrackId, algoliaResponseByAlgoliaId] =
            await Promise.all([
              getTrackDetails(memoizedIds),
              getTrackDetailsByAlgoliaId(memoizedAlgoliaIds),
            ]);

          const algoliaResponse = [
            ...(algoliaResponseByTrackId || []),
            ...(algoliaResponseByAlgoliaId || []),
          ];

          console.log("algoliaResponse", algoliaResponse);

          // --- Step 3: Merge playlist data with Algolia ---
          const mergedTracks = data.tracks.map((track) => {
            const match = algoliaResponse?.find((alg) => {
              if (track?.algoliaId) {
                // match using Algolia objectID if present
                return String(alg?.objectID) === String(track?.algoliaId);
              } else {
                // otherwise match using sonichub_track_id
                return (
                  String(alg?.sonichub_track_id) === String(track?.objectID)
                );
              }
            });

            return { ...track, ...(match || {}) }; // merge per track
          });

          // --- Step 4: Return enriched playlist ---
          return {
            ...data,
            tracks: mergedTracks,
          };
        } catch (error) {
          console.error("Error merging Algolia data:", error);
          return data; // fallback - return original data
        }
      } else {
        // No valid IDs found
        return data;
      }
    } catch (error) {
      throw new NetworkingError("Failed getLinkValidity!");
    }
  }

  create(playlist) {
    return this.asyncService
      .postData("/playlist2050", playlist)
      .then((response) => {
        return response;
      })
      .catch(() => {
        throw new NetworkingError("Failed creating Playlist!");
      });
  }

  update(playListId, newName, newDescription, newCoverImage) {
    newCoverImage === "" && (newCoverImage = null);
    const data = {
      id: playListId,
      name: newName,
      description: newDescription,
      coverImage: newCoverImage,
    };
    return this.asyncService
      .putData(`/playlist2050/${playListId}`, data)
      .then((response) => {
        return response;
      })
      .catch(() => {
        throw new NetworkingError(`Failed updating Playlists ${playListId}!`);
      });
  }

  remove(playListId) {
    return this.asyncService
      .remove(`/playlist2050/${playListId}`)
      .then((response) => {
        return response;
      })
      .catch(() => {
        throw new NetworkingError(`Failed deleting Playlists ${playListId}!`);
      });
  }

  addTrack(playListId, trackId) {
    //let data = Array.isArray(trackId) ? { id: trackId } : { id: [trackId] };
    let data = trackId;
    console.log("data", data);
    return this.asyncService
      .postData(`/playlist2050/${playListId}`, data)
      .then((response) => {
        return response;
      })
      .catch(() => {
        throw new NetworkingError(
          `Failed adding Track ${trackId}to Playlists ${playListId}!`
        );
      });
  }

  removeTrack(playListId, trackId, algoliaId) {
    console.log("ids", playListId, trackId, algoliaId);
    const trackData = [{ trackId: trackId, algoliaId: algoliaId }];
    return (
      this.asyncService
        //.remove(`/playlist2050/${playListId}/tracks/${trackId}`)
        .postData(`/playlist2050/${playListId}/tracks`, trackData)
        .then((response) => {
          return response;
        })
        .catch(() => {
          throw new NetworkingError(
            `Failed deleting Track ${trackId} from Playlist ${playListId}!`
          );
        })
    );
  }

  addMembers(playListId, userIds) {
    return this.asyncService
      .postData(`/playlist2050/${playListId}/users`, userIds)
      .then((response) => {
        return response;
      })
      .catch(() => {
        throw new NetworkingError(
          `Failed adding Members ${userIds} to Playlist ${playListId}!`
        );
      });
  }

  addMembersExternal(playListId, userIds) {
    return this.asyncService
      .postData(`/playlist2050/${playListId}/usersExternal`, userIds)
      .then((response) => {
        return response;
      })
      .catch(() => {
        throw new NetworkingError(
          `Failed adding Members ${userIds} to Playlist ${playListId}!`
        );
      });
  }

  addCombineMembers(playListId, userIds, userEmails) {
    let inviteStatus = "00";
    if (JSON.parse(userIds).members.length > 0) {
      inviteStatus = this.addMembers(playListId, userIds).then(() => {
        return "10";
      });
    }
    if (JSON.parse(userEmails).members.length > 0) {
      inviteStatus = this.addMembersExternal(playListId, userEmails).then(
        () => {
          return "11";
        }
      );
    }
    inviteStatus.then(function () {
      // console.log("inviteStatus then " + inviteStatus);
    });
    // console.log("inviteStatus " + inviteStatus);
    return inviteStatus;
  }

  removeMember(playListId, userId) {
    return this.asyncService
      .remove(`/playlist2050/${playListId}/users/${userId}`)
      .then((response) => {
        return response;
      })
      .catch(() => {
        throw new NetworkingError(
          `Failed deleting Member ${userId} from Playlist ${playListId}!`
        );
      });
  }

  triggerPlaylistDownloadCount(id) {
    const data = JSON.stringify({
      playlist_id: id,
    });
    return this.asyncService.postData("/download/playlist", data).catch(() => {
      throw new NetworkingError("Failed Triggering playlist Download Count!");
    });
  }

  getGeneralLink(playListId, validityData) {
    return this.asyncService
      .postData(
        `/playlist2050/${playListId}/usersExternalforLink`,
        validityData
      )
      .then((response) => {
        // console.log("getGeneralLink- response Link " + response);
        return response;
      })
      .catch(() => {
        throw new NetworkingError(
          `Failed getting general link for Playlist ${playListId}!`
        );
      });
  }

  updateGeneralLink(playListId, validityData, params) {
    //http://localhost:3002/api/playlist2050/validity?validityPeriod=24&playlistId=103&url=http://local
    return this.asyncService
      .putData("/playlist2050/validity" + params, validityData)
      .then((response) => {
        // console.log("updateGeneralLink- response Link " + response);
        return response;
      })
      .catch(() => {
        throw new NetworkingError(
          `Failed updating general link for Playlist ${playListId}!`
        );
      });
  }

  //removeMemberUnregistered(playListId, userEmail) {
  removeMemberUnregistered(playListId, userEmail, url) {
    //ref request http://localhost:8080/api/playlist2050/playlistId/UnregisteredUsers/emailId

    //for deleting links without email id, we need to pass some other data to API
    //confirm from backend and pass data accordingly, possible data could be url or randomcode
    //change below url accordingly

    //api request

    //http://localhost:8080/api/playlist2050/103/UnregisteredUsers/te@wits.bz?link=http://local
    //URL=http://localhost:8080/api/playlist2050/103/UnregisteredUsers/null?link=http://local
    //URL=http://localhost:8080/api/playlist2050/103/UnregisteredUsers/trupti.pawar@gophygital.io?link=NA

    // console.log("removeMemberUnregistered : " + playListId + " | " + userEmail);
    if (userEmail === null || userEmail === "") {
      return this.asyncService
        .remove(
          `/playlist2050/${playListId}/UnregisteredUsers/${userEmail}?link=${escape(
            url
          )}`
        )
        .then((response) => {
          return response;
        })
        .catch(() => {
          throw new NetworkingError(
            `Failed deleting Link from Playlist ${playListId}!`
          );
        });
    } else {
      return this.asyncService
        .remove(
          `/playlist2050/${playListId}/UnregisteredUsers/${userEmail}?link=NA`
        )
        .then((response) => {
          return response;
        })
        .catch(() => {
          throw new NetworkingError(
            `Failed deleting Member ${userEmail} from Playlist ${playListId}!`
          );
        });
    }
  }
}

export default new PlaylistService(AsyncService);
