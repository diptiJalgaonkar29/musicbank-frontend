// withOsContext.js
import React from 'react';
import { useOs } from '@wppopen/react';
//import { OsContext, OsApiContext } from './OsContexts';

const withOsContext = (Component) => (props) => {
    const { osContext, osApiContext } = useOs();
    return <Component {...props} osContext={osContext} osApiContext={osApiContext} />;
   };

/* const withOsContext = (Component) => (props) => {(
 <OsContext.Consumer>
    {(osContext) => (
      <OsApiContext.Consumer>
        {(osAPI) => <Component {...props} osContext={osContext} osAPI={osAPI} />}
      </OsApiContext.Consumer>
    )}
 </OsContext.Consumer>
)}; */

export default withOsContext;
