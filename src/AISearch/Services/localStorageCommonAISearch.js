export const localStorageCommonAISearch = (key, newData) => {
  const existingData = JSON.parse(localStorage.getItem(key)) || {};
  const updatedData = { ...existingData, ...newData };
  localStorage.setItem(key, JSON.stringify(updatedData));
};
