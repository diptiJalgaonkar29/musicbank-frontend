import { compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import rootReducer from "../reducers/index"; //import from index.js
import { thunk } from "redux-thunk";
import { applyMiddleware } from "redux";
// import { encryptTransform } from "redux-persist-transform-encrypt";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "notificationTopBar",
    "trackFilters",
    "videoUpload",
    "userMeta",
    "trackData",
  ], // only these will be persisted
  // transforms: [
  //   encryptTransform({
  //     secretKey: "my-super-secret-key",
  //     onError: function (error) {
  //       console.log("encryptTransform :: ", error);
  //     },
  //   }),
  // ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// This is to Set Up Dev Tools, and will disable it in Production mode
const isInDevelopmentMode = process.env.NODE_ENV === "development";
const hasReduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== undefined;
const composeEnhancers =
  isInDevelopmentMode && hasReduxDevTools
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);
