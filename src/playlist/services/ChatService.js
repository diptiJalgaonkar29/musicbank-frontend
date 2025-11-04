import AsyncService from '../../networking/services/AsyncService';
import { NetworkingError } from '../../common/model/NetworkingError';

class ChatService {

  constructor(asyncService) {
    this.asyncService = asyncService;
  }

  getAllByPlaylistIdAndLastSyncTime(playlistId, lastSyncTime) {
    return this.asyncService.loadData(`/comment2050?playlistId=${playlistId}&lastSyncTime=${lastSyncTime}`).then(response => {
      return response.data;
    }).catch(() => {
      throw new NetworkingError('Failed loading Playlists!');
    });
  }

  getAllByPlaylistIdAndLastSyncTimeUnregistered(playlistId, lastSyncTime, _validateFor) {
    //console.log('getAllByPlaylistIdAndLastSyncTimeUnregistered ' + playlistId, _validateFor);
    //http://localhost:8080/api/comment2050/commmentExt?playlistId=107
    const headerJSON = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let mCodeValidateFor = JSON.stringify({ 'mcode': _validateFor });

    return this.asyncService.loadDataParam(`/comment2050/commmentExt?playlistId=${playlistId}&lastSyncTime=${lastSyncTime}`, mCodeValidateFor, headerJSON).then(response => {
      return response.data;
    }).catch(() => {
      throw new NetworkingError('Failed loading Playlists!');
    });
  }

  getAllByPlaylistId(playlistId) {
    if (!playlistId) { return Promise.resolve([]); }
    return this.asyncService.loadData(`/comment2050?playlistId=${playlistId}`).then(response => {
      return response.data;
    }).catch(() => {
      throw new NetworkingError('Failed loading Playlists!');
    });
  }

  getAllByPlaylistIdUnregistered(playlistId, _validateFor) {
    //http://localhost:3002/api/comment2050/commmentExt?playlistId=125
    const headerJSON = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let mCodeValidateFor = JSON.stringify({ 'mcode': _validateFor });
    return this.asyncService.loadDataParam(`/comment2050/commmentExt?playlistId=${playlistId}`, mCodeValidateFor, headerJSON).then(response => {
      return response.data;
    }).catch(() => {
      throw new NetworkingError('Failed loading Playlists!');
    });
  }

  add(playlistId, text) {
    const data = JSON.stringify(
      {
        playlistId: playlistId,
        message: text
      },
      null,
      2
    );
    return this.asyncService.postData('/comment2050', data).then(response => {
      return response;
    }).catch(() => {
      throw new NetworkingError('Failed creating Comment!');
    });
  }

  update(commentId, playlistId, text) {
    const data = JSON.stringify(
      {
        id: commentId,
        playlistId: playlistId,
        message: text
      },
      null,
      2
    );
    return this.asyncService.putData(`/comment2050/${commentId}`, data).then(response => {
      return response;
    }).catch(() => {
      throw new NetworkingError('Failed updating Comment!');
    });
  }

  remove(commentId) {
    return this.asyncService.remove(`/comment2050/${commentId}`).then(response => {
      return response;
    }).catch(() => {
      throw new NetworkingError('Failed removing Comment!');
    });
  }

}

export default new ChatService(AsyncService);
