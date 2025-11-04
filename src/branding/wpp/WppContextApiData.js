import React from 'react';
import { useState } from 'react';
import { useOs } from '@wppopen/react';


const WppOsContext = useOs();
const WppOsApi = useOs();

export { WppOsContext, WppOsApi };




/* export const WppContextApiData = () => {
    const { osContext, osApi } = useOs();

    const [osWppContext, setOsWppContext] = useState({osContext});
    const [osWppApi, setOsWppApi] = useState({osApi});

    console.log("osContext", osContext);
    console.log("osApi", osApi);

    const getWPPContextObject = () => {        
        console.log("getWPPContextObject--osContext", osWppContext);
        return osContext;
    }

    const getWPPContextApi = () => {        
        console.log("getWPPContextApi--osApi", osWppApi);
        console.log("getWPPContextApi--osApi", osWppApi.getAccessToken());
        return osApi;
    }    
}

export default WppContextApiData; */