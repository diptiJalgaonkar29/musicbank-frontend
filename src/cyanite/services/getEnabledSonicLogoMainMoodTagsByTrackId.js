import AsyncService from "../../networking/services/AsyncService";

const getEnabledSonicLogoMainMoodTagsByTrackId = ({
  trackId,
  onSuccess,
  onError,
  onFinally,
}) => {
  AsyncService.loadData(`/sonicLogoMainMoodTagMaster/enabledTags/${trackId}`)
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

export default getEnabledSonicLogoMainMoodTagsByTrackId;
