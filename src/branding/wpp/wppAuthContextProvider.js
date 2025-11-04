// withOsContext.js
import React from 'react';
import { WppOsContext, WppOsApi } from './WppContextApiData';

const wppAuthContextProvider = (Component) => (props) => (
 <WppOsContext.Consumer>
    {(osContext) => (
      <WppOsApi.Consumer>
        {(osAPI) => <Component {...props} osContext={osContext} osAPI={osAPI} />}
      </WppOsApi.Consumer>
    )}
 </WppOsContext.Consumer>
);

export default wppAuthContextProvider;
