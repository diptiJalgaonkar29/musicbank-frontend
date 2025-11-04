import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  createContext,
} from "react";
import { connectToParent } from "penpal";
import getSuperBrandName from "../../common/utils/getSuperBrandName";

const OsContext = createContext(null);

export const WPPOsProvider = ({ children }) => {
  const [osApiValue, setOsApiValue] = useState(null);
  const [osContextValue, setOsContextValue] = useState(null);
  const [osToken, setOsToken] = useState(null);
  const connectionRef = useRef(null);

  console.log("WPPOsProvider::--brandname", getSuperBrandName());

  // Load cached context/token at mount (works both for iframe and non-iframe)
  useEffect(() => {
    const cachedContext = localStorage.getItem("csOsContext");
    const cachedToken = localStorage.getItem("csToken");

    if (cachedContext) {
      try {
        const parsed = JSON.parse(cachedContext);
        setOsContextValue(parsed);
        console.log("%cLoaded cached osContext", "background:#d9f7be;", parsed);
      } catch (e) {
        console.warn("Failed to parse cached osContext", e);
      }
    }
    if (cachedToken) {
      setOsToken(cachedToken);
      console.log(
        "%cLoaded cached osToken",
        "background:#d9f7be;",
        cachedToken
      );
    }
  }, []);

  useEffect(() => {
    if (connectionRef.current) return;

    if (window.parent === window) {
      // 🚀 Local dev mock if not inside iframe
      console.warn("Not inside iframe → mocking osContext for local dev");
      // const mockContext = {
      //   theme: { color: "red", font: "Arial" },
      //   userDetails: { name: "Dev User" },
      // };
      // setOsContextValue(mockContext);
      // setOsApiValue({ getAccessToken: async () => "mock-local-token" });
      // setOsToken("mock-local-token");
      return;
    }

    // ✅ Strict iframe flow
    const methods = {
      receiveOsContext: (osContext) => {
        console.log(
          "%creceiveOsContext",
          "padding:5px 10px; background:#ffaa8c;"
        );
        console.log(osContext);
        if (osContext) {
          setOsContextValue(osContext);
          localStorage.setItem("csOsContext", JSON.stringify(osContext));
          localStorage.setItem("csThemeData", JSON.stringify(osContext.theme));
        }
      },
    };

    const connection = connectToParent({
      parentOrigin: "*",
      methods,
      debug: true,
    });

    connectionRef.current = connection;

    connection.promise
      .then(async (parentApi) => {
        console.log(
          "%cChild received API methods",
          "padding:5px 10px; background:#eda9d2;"
        );
        console.log(parentApi);

        setOsApiValue(parentApi);

        try {
          if (parentApi?.osApi?.getAccessToken) {
            const token = await parentApi.osApi.getAccessToken();
            if (token) {
              console.log(
                "%cAccess token fetched",
                "padding:5px 10px; background:#96d8be;",
                token
              );
              setOsToken(token);
              localStorage.setItem("csToken", token);
            }
          }

          if (parentApi?.osApi?.getOsContext) {
            const ctx = await parentApi.osApi.getOsContext();
            if (ctx) {
              console.log(
                "%cFetched osContext from parent",
                "padding:5px 10px; background:#aee0ff;",
                ctx
              );
              setOsContextValue(ctx);
              localStorage.setItem("csOsContext", JSON.stringify(ctx));
            }
          }
        } catch (err) {
          console.error("Error fetching from parentApi:", err);
        }
      })
      .catch((error) => {
        console.error("Penpal child context error:", error);
      });

    return () => {
      console.log(
        "%cDestroying child connection",
        "padding:5px 10px; background:#96d8be;"
      );
      if (connectionRef.current?.destroy) connectionRef.current.destroy();
      connectionRef.current = null;
    };
  }, []);

  // Persist theme separately
  // useEffect(() => {
  //   if (osContextValue?.theme) {
  //     localStorage.setItem("csThemeData", JSON.stringify(osContextValue.theme));
  //   }
  // }, [osContextValue?.theme]);

  console.log("::::", { osContextValue, osApiValue, osToken });

  // 🚨 Block rendering if in iframe and required values are missing
  const isInIframe = window.parent !== window;
  if (isInIframe && (!osToken || !osContextValue || !osApiValue)) {
    return <p className="loader">Loading...</p>;
  }

  return (
    <OsContext.Provider
      value={{ osContext: osContextValue, osApi: osApiValue, osToken }}
    >
      {children}
    </OsContext.Provider>
  );
};

export const useWPPOs = () => useContext(OsContext);
