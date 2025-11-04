// AlgoliaIndexContext.js
import { createContext, useContext, useState } from "react";

export const AlgoliaIndexContext = createContext();

export const useAlgoliaIndex = () => useContext(AlgoliaIndexContext);

export const AlgoliaIndexProvider = ({ children }) => {
  const [indexName, setIndexName] = useState("tracksData_Search");

  return (
    <AlgoliaIndexContext.Provider value={{ indexName, setIndexName }}>
      {children}
    </AlgoliaIndexContext.Provider>
  );
};
