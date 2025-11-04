// OsContexts.js
import React from "react";
import { useOs } from "@wppopen/react";

//const { OsContext, OsApiContext } = useOs();

const OsContext = useOs();
const OsApiContext = useOs();

// console.log("OsContext:::", OsContext,OsApiContext);

export { OsContext, OsApiContext };
