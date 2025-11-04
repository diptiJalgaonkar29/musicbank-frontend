import { findIndex } from "lodash";

const toggleTag = (data, key, itemToToggle) => {
  let dataObj = { ...data };
  if (!dataObj[key]) {
    console.error(`Key "${key}" does not exist in dataObj`);
    return;
  }
  const index = findIndex(dataObj[key], { value: itemToToggle.value });

  if (index > -1) {
    dataObj[key].splice(index, 1);
  } else {
    dataObj[key].push(itemToToggle);
  }
  return dataObj;
};

export default toggleTag;
