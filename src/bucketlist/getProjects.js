// import showNotification from "../../../common/helperFunctions/showNotification";

import AsyncService from "../networking/services/AsyncService";

const getProjects = ({ limit, onSuccess, onError }) => {
  let apiPath;
  if (limit) {
    apiPath = `/project/getProjects?limit=${limit}`;
  } else {
    apiPath = `/project/getAllProjectsOfUser`;
  }
  AsyncService.loadData(apiPath)
    .then((response) => {
      onSuccess?.(response);
    })
    .catch((err) => {
      console.log("Error while fetching projects", err);
      // showNotification("ERROR", "Something went wrong");
      onError?.();
    });
};

export default getProjects;
