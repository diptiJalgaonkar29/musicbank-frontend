// import { connect } from 'penpal';

// let osContextDetails = null;
// let osApiDetails = null;

// export const GetOsContextData = async () => {
//   console.log("GetOsContextData ");

//   const connection = connect({
//     parentOrigin: "*",
//     methods: {
//       receiveOsContext: async (osContext) => {
//         console.log(
//           `%cgetOSContextData::receiveOsContext`,
//           "padding:5px 10px; background: #ffaa8c;"
//         );
//         console.log(osContext);
//         osContextDetails = await osContext;
//         console.log(
//           `%cgetOSContextData::osContextDetails`,
//           "padding:5px 10px; background: #ffaa8c;"
//         );
//         console.log("User Details: ", osContextDetails.userDetails);
//         console.log(
//           "Theme Details: ",
//           osContextDetails.theme.color,
//           osContextDetails.theme.font
//         );
//       },
//     },
//     debug: true,
//   });
//   console.log("connection", connection);

//   // connection.promise.then((context) => {
//   //   console.log(
//   //     `%cgetOSContextData :: Connection`,
//   //     "padding:5px 10px; background: #98c3ec;"
//   //   );
//   //   console.log(context);
//   //   osApiDetails = context;
//   //   osApiDetails = context.osApi.getAccessToken().then((token) => {
//   //     console.log(
//   //       `%cgetOSContextData :: getAccessToken`,
//   //       "padding:5px 10px; background: #98c3ec;"
//   //     );
//   //     console.log(token);
//   //   });
//   // });

//   const context = await connection.promise;
//   console.log(
//     `%cgetOSContextData :: Connection`,
//     "padding:5px 10px; background: #98c3ec;"
//   );
//   osApiDetails = context;
//   const osAccessToken = await context.osApi.getAccessToken();
//   console.log(
//     `%cgetOSContextData :: getAccessToken`,
//     "padding:5px 10px; background: #98c3ec;"
//   );
//   console.log("osAccessToken", osAccessToken);
//   console.log("osContextDetails", osContextDetails);
//   console.log("osApiDetails", osApiDetails);
//   console.log("context", JSON.stringify(context));

//   return { osContextDetails, osApiDetails, context, osAccessToken };
// };

// export default GetOsContextData;

import { useEffect, useState, useRef } from "react";
import { connectToParent } from "penpal/lib/index.js"; // v6.2.1 import path

export const useOsContextData = () => {
  const [osContextDetails, setOsContextDetails] = useState(null);
  const [osApiDetails, setOsApiDetails] = useState(null);
  const [osAccessToken, setOsAccessToken] = useState(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    console.log("Initializing Penpal connection...");

    const methods = {
      receiveOsContext: (osContext) => {
        console.log(
          "%creceiveOsContext",
          "padding:5px 10px; background:#ffaa8c;"
        );
        console.log(osContext);
        setOsContextDetails(osContext);
      },
    };

    // Connect to parent (v6)
    const connection = connectToParent({
      parentOrigin: "*", // ideally replace * with actual WPP origin
      methods,
      debug: true,
    });

    connectionRef.current = connection;

    connection.promise
      .then(async (parentApi) => {
        console.log(
          "%cConnection established",
          "padding:5px 10px; background:#98c3ec;"
        );
        setOsApiDetails(parentApi);

        try {
          if (parentApi.getAccessToken) {
            const token = await parentApi.getAccessToken();
            console.log(
              "%cAccess token fetched",
              "padding:5px 10px; background:#96d8be;",
              token
            );
            setOsAccessToken(token);
          } else {
            console.warn("Parent API does not provide getAccessToken");
          }
        } catch (err) {
          console.error("Error fetching access token:", err);
        }
      })
      .catch((err) => {
        console.error("Penpal child context error:", err);
      });

    return () => {
      console.log("Cleaning up Penpal connection...");
      if (connectionRef.current?.destroy) connectionRef.current.destroy();
      connectionRef.current = null;
    };
  }, []);

  return { osContextDetails, osApiDetails, osAccessToken };
};
