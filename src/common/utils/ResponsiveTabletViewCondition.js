import { isMobile } from 'react-device-detect';

export function ResponsiveTabletViewCondition768() {
  return isMobile && window.innerWidth < 768;
}
