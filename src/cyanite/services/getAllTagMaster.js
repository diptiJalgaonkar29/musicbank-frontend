import AsyncService from "../../networking/services/AsyncService";

const getAllTagMaster = ({ masterId, onSuccess, onError, onFinally }) => {
  AsyncService.loadDataUnauthorized(
    `/ampMainMoodTagMaster/getAllData/${masterId}`
  )
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

export default getAllTagMaster;
