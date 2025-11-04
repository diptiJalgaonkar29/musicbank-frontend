import React from 'react';

import { DISCLAIMER, DISCLAIMER_ROUTE, PRIVACY_POLICY, PRIVACY_POLICY_ROUTE, TERMS_AND_CONDITIONS_ROUTE, TERMS_OF_USE } from '../../../../document/constants/constants';
import { withRouterCompat } from '../../../../common/utils/withRouterCompat';

const FooterLinks = ({ navigate }) => {
  return (
    <>
      <span
        onClick={() => {
          navigate(PRIVACY_POLICY_ROUTE);
        }}
      >
        {PRIVACY_POLICY}
      </span>
            &nbsp;|&nbsp; 
      <span
        onClick={() => {
          navigate(TERMS_AND_CONDITIONS_ROUTE);
        }}
      >
        {TERMS_OF_USE}
      </span>{' '}
            &nbsp;|&nbsp; 
      <span
        onClick={() => {
          navigate(DISCLAIMER_ROUTE);
        }}
      >
        {DISCLAIMER}
      </span>
    </>
  );
};


const FooterLinksWithRouter = withRouterCompat(FooterLinks);

export default FooterLinksWithRouter;