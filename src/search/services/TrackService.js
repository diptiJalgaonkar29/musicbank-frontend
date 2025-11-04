import { NetworkingError } from '../../common/model/NetworkingError';
import AsyncService from '../../networking/services/AsyncService';

class TrackService {
  constructor(asyncService) {
    this.asyncService = asyncService;
  }

  triggerDownloadCount(mediaType, id) {
    const data = JSON.stringify({
      track_id: id,
      audio_type: mediaType
    });
    return this.asyncService
      .postData('/statistics/downloads', data)
      .catch(() => {
        throw new NetworkingError('Failed Triggering Download Count!');
      });
  }

  postFeedback(data) {
    return this.asyncService.postData('/feedback', data).catch(() => {
      throw new NetworkingError('Failed Posting Feedback!');
    });
  }
}

export default new TrackService(AsyncService);
