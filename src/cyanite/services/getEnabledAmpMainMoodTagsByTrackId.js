import AsyncService from "../../networking/services/AsyncService";

const getEnabledAmpMainMoodTagsByTrackId = ({
  trackId,
  onSuccess,
  onError,
  onFinally,
}) => {
  AsyncService.loadData(`/ampMainMoodTagMaster/enabledTags/${trackId}`)
    .then((res) => {
      onSuccess && onSuccess(res);
    })
    .catch((err) => {
      console.error("Error", err);
      onError && onError(err);
    })
    .finally(() => {
      onFinally && onFinally();
    });
};

export default getEnabledAmpMainMoodTagsByTrackId;
