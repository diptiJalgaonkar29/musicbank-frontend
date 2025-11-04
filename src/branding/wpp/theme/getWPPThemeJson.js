import _ from "lodash";

let wppThemeDataL = {};
let wppThemeData = {};

const addBrandFont = () => {
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", wppThemeData.settings.fontUrl);
  document.head.appendChild(link);
};
//addBrandFont();

const getWPPThemeJson = (osContextDetails) => {
  //const osContextDetails = await useWPPOs();
  console.log("osContextDetails***::getWPPThemeJson", osContextDetails);
  //console.log("Theme Details***::getWPPThemeJson", osContextDetails?.theme?.color, osContextDetails?.theme?.font);
  wppThemeData = osContextDetails?.theme;
  wppThemeDataL = osContextDetails?.theme;
  console.log("wppThemeDataL::getWPPThemeJson", wppThemeDataL);
  console.log(
    "getwppthemejson:: primary",
    _.get(wppThemeData, "color.brand.default")
  );

  //addBrandFont();

  const themeColor = osContextDetails?.theme?.color;
  let themeObj = {
    "--color-bg-old":
      "linear-gradient(180deg, #000, #2e2e2e 300px, #000 1000px)",
    "--color-bg": _.get(wppThemeData, "surface.bgColor"),
    "--color-navbar":
      "linear-gradient(to right, #000 0, #000 40%, rgba(0, 0, 0, 0.6) 60%)",
    "--color-error": wppThemeDataL.color.danger[400],
    "--color-success": wppThemeDataL.color.success[200],
    "--color-green": wppThemeDataL.color.warning[200],
    "--color-canvas-lightest": _.get(wppThemeData, "text.color.default"),
    "--color-canvas-lighter": "#404040",
    "--color-canvas-light": "#454545",
    "--color-canvas": _.get(wppThemeData, "surface.bgColor"),
    "--color-card": wppThemeDataL.color.grey[300],
    "--color-canvas-darker": "#202125",
    "--color-canvas-darkest": "#04070e",
    "--color-main": "#1daeec",
    "--color-primary": _.get(wppThemeData, "color.brand.default"),
    "--color-secondary": wppThemeDataL.color.primary[400],
    "--color-register": wppThemeDataL.color.primary[200],
    "--color-alternative": wppThemeDataL.color.primary[300],
    "--color-white": _.get(wppThemeData, "text.color.default"),
    "--color-black": "#000000",
    "--color-gray": "#999",
    "--color-lightgray": wppThemeDataL.color.grey[300],
    "--browse-background-color": _.get(wppThemeData, "surface.bgColor"),
    //"--browse-background-color": "#000",
    "--track-detail-background-color": _.get(wppThemeData, "surface.bgColor"),
    "--login-background-color": "transparent",
    "--download-button-radius": "0px",
    "--border-radius-sm": "0px",
    "--border-radius-ml": "15px",
    "--border-radius-xl": "30px",
    "--nav-underline": "0px",
    "--navbar-positon": "flex-end",
    "--searchInput-radius": "0px",
    "--searchInput-color": "82, 168, 236",
    "--font-primary-color": _.get(wppThemeData, "text.color.default"),
    //"--font-primary": "WPP-Regular",
    "--font-primary": wppThemeDataL.font.family,
    "--font-primary-light": wppThemeDataL.font.family,
    "--font-primary-bold": wppThemeDataL.font.family,
    "--color-trackcard-showall": "#00adef15",

    "--color-bubbletag-tonality-bg": wppThemeDataL.color.dataviz.cat.light[1],
    "--color-bubbletag-feelings-bg": wppThemeDataL.color.dataviz.cat.light[2],

    "--color-bubbletag-impact-bg": wppThemeDataL.color.dataviz.cat.light[4],
    "--color-bubbletag-motion-bg": wppThemeDataL.color.dataviz.cat.light[5],
    "--color-bubbletag-instrument-bg": wppThemeDataL.color.dataviz.cat.light[6],
    "--color-bubbletag-usedIn-bg": wppThemeDataL.color.dataviz.cat.light[7],
    "--color-bubbletag-key-bg": wppThemeDataL.color.dataviz.cat.light[8],

    "--color-bubbletag-tonality-text": _.get(
      wppThemeData,
      "text.color.default"
    ),
    "--color-bubbletag-feelings-text": _.get(
      wppThemeData,
      "text.color.default"
    ),

    "--color-bubbletag-amp_allmood_ids-bg":
      themeColor?.primary?.[400] || wppThemeDataL.color.primary[400],
    "--color-bubbletag-amp_mainmood_ids-bg":
      themeColor?.primary?.[400] || wppThemeDataL.color.primary[400],
    "--color-bubbletag-asset_type_ids-bg":
      themeColor?.primary?.[100] || wppThemeDataL.color.primary[100],
    "--color-bubbletag-genre-bg":
      themeColor?.primary?.[300] || wppThemeDataL.color.primary[300],
    "--color-bubbletag-tempo-bg":
      themeColor?.primary?.[200] || wppThemeDataL.color.primary[200],
    "--color-bubbletag-soniclogo_mainmood_ids-bg":
      themeColor?.primary?.[400] || wppThemeDataL.color.primary[400],
    "--color-bubbletag-amp_mainmood_ids-text":
      themeColor?.grey?.[300] || wppThemeDataL.color.grey[300],

    "--color-bubbletag-genre-text": _.get(wppThemeData, "text.color.default"),
    "--color-bubbletag-tempo-text": _.get(wppThemeData, "text.color.default"),
    "--color-bubbletag-soniclogo_mainmood_ids-text": _.get(
      wppThemeData,
      "text.color.default"
    ),

    "--color-overtimechart-1": wppThemeDataL.color.dataviz.cat.light[1],
    "--color-overtimechart-2": wppThemeDataL.color.dataviz.cat.light[2],
    "--color-overtimechart-3": wppThemeDataL.color.dataviz.cat.light[3],
    "--color-overtimechart-4": wppThemeDataL.color.dataviz.cat.light[4],
    "--color-overtimechart-5": wppThemeDataL.color.dataviz.cat.light[5],
    "--color-overtimechart-6": wppThemeDataL.color.dataviz.cat.light[6],
    "--color-overtimechart-7": wppThemeDataL.color.dataviz.cat.light[7],
    "--color-overtimechart-8": wppThemeDataL.color.dataviz.cat.light[8],
    "--color-overtimechart-9": wppThemeDataL.color.dataviz.cat.light[9],
    "--color-overtimechart-10": wppThemeDataL.color.dataviz.cat.light[10],
    "--color-overtimechart-11": wppThemeDataL.color.dataviz.cat.neutral[1],
    "--color-overtimechart-12": wppThemeDataL.color.dataviz.cat.neutral[2],
    "--color-overtimechart-13": wppThemeDataL.color.dataviz.cat.neutral[3],
    "--color-overtimechart-14": wppThemeDataL.color.dataviz.cat.neutral[4],
    "--color-overtimechart-15": wppThemeDataL.color.dataviz.cat.neutral[5],
    "--color-overtimechart-16": wppThemeDataL.color.dataviz.cat.neutral[6],
    "--color-overtimechart-17": wppThemeDataL.color.dataviz.cat.neutral[7],
    "--color-overtimechart-18": wppThemeDataL.color.dataviz.cat.neutral[8],
    "--color-overtimechart-19": wppThemeDataL.color.dataviz.cat.neutral[9],
    "--color-overtimechart-20": wppThemeDataL.color.dataviz.cat.neutral[10],

    "--color-radarchart-primary": wppThemeDataL.color.primary[300],

    "--color-piechart-primary": wppThemeDataL.color.dataviz.cat.light[1],
    "--color-piechart-secondary": wppThemeDataL.color.dataviz.cat.light[2],
    "--color-piechart-tertiary": wppThemeDataL.color.dataviz.cat.light[3],
    "--color-piechart-quaternary": wppThemeDataL.color.dataviz.cat.light[4],
    "--color-piechart-quinary": wppThemeDataL.color.dataviz.cat.light[5],
    "--color-piechart-senary": wppThemeDataL.color.dataviz.cat.light[6],

    "--color-footer": wppThemeDataL.color.primary[400],

    "--opacity-bubbletag-tonality": "100",
    "--opacity-bubbletag-feelings": "100",
    "--opacity-bubbletag-genre": "100",

    "--color-register-cancel-btn": "#ed7fad",

    //'--opacity-bubbletag-tonality': '20',
    //'--opacity-bubbletag-feelings': '40',
    //'--opacity-bubbletag-genre': '60'
    "--wpp-color-brand": _.get(wppThemeData, "color.brand.default"),
    "--button-secondary-border-color": _.get(
      wppThemeData,
      "color.brand.default"
    ),
    // "--wpp-button-secondary-icon-color": _.get(
    //   wppThemeData,
    //   "color.brand.default"
    // ),
    "--wpp-button-secondary-border-color": "transparent",
    "--wpp-button-secondary-bg-color-hover":
      _.get(wppThemeData, "color.brand.default") + "10",
    "--wpp-slider-handle-bg-color-hover":
      _.get(wppThemeData, "color.brand.default") + "10",
    /* "--wpp-slider-track-bg-color-active": _.get(wppThemeData, "color.brand.default"),
    "--wpp-slider-handle-bg-color-active": _.get(wppThemeData, "color.brand.default"),
    "--wpp-slider-handle-border-color": _.get(wppThemeData, "color.brand.default"),
    "--wpp-slider-handle-bg-color-hover": _.get(wppThemeData, "color.brand.default"),
    "--wpp-slider-handle-bg-color-active": _.get(wppThemeData, "color.brand.default"),
    "--wpp-slider-handle-bg-color": _.get(wppThemeData, "color.brand.default"), */
    "--wpp-tab-text-color": _.get(wppThemeData, "color.brand.default"),
    "--wpp-tab-text-color-selected": _.get(wppThemeData, "color.brand.default"),
    "--wpp-tab-text-color-hover": _.get(wppThemeData, "color.brand.default"),
  };
  // console.log("themeObj:::::::", themeObj);
  return themeObj;
};

export default getWPPThemeJson;

/* import _ from "lodash";
// import wppThemeData from "@wppopen/components-library/dist/collection/wpp-theme.json";
import wppThemeData from "../themejsons/wpp.json";
import GetOsContextData from "../GetOsContextData";

let wppThemeDataL = wppThemeData.content.light;

const addBrandFont = () => {
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", wppThemeData.settings.fontUrl);
  document.head.appendChild(link);
};
addBrandFont();

const getWPPThemeJson = async () => {
  const osContextDetails = await GetOsContextData();
  console.log("osContextDetails***::getWPPThemeJson", osContextDetails);
  console.log(
    "Theme Details***::getWPPThemeJson",
    osContextDetails?.osContextDetails?.theme?.color,
    osContextDetails?.osContextDetails?.theme?.font
  );
  const themeColor = osContextDetails?.osContextDetails?.theme?.color;
  let themeObj = {
    "--color-bg-old":
      "linear-gradient(180deg, #000, #2e2e2e 300px, #000 1000px)",
    "--color-bg": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.surface.bgColor")
    ),
    "--color-navbar":
      "linear-gradient(to right, #000 0, #000 40%, rgba(0, 0, 0, 0.6) 60%)",
    "--color-error": wppThemeDataL.color.danger[400],
    "--color-success": wppThemeDataL.color.success[200],
    "--color-green": wppThemeDataL.color.warning[200],
    "--color-canvas-lightest": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.text.color.default")
    ),
    "--color-canvas-lighter": "#404040",
    "--color-canvas-light": "#454545",
    "--color-canvas": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.surface.bgColor")
    ),
    "--color-card": wppThemeDataL.color.grey[300],
    "--color-canvas-darker": "#202125",
    "--color-canvas-darkest": "#04070e",
    "--color-main": "#1daeec",
    "--color-primary": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.color.brand.default")
    ),
    "--color-secondary": wppThemeDataL.color.primary[400],
    "--color-register": wppThemeDataL.color.primary[200],
    "--color-alternative": wppThemeDataL.color.primary[300],
    "--color-white": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.text.color.default")
    ),
    "--color-black": "#000000",
    "--color-gray": "#999",
    "--color-lightgray": wppThemeDataL.color.grey[300],
    "--browse-background-color": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.surface.bgColor")
    ),
    //"--browse-background-color": "#000",
    "--track-detail-background-color": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.surface.bgColor")
    ),
    "--login-background-color": "transparent",
    "--download-button-radius": "0px",
    "--border-radius-sm": "0px",
    "--border-radius-ml": "15px",
    "--border-radius-xl": "30px",
    "--nav-underline": "0px",
    "--navbar-positon": "flex-end",
    "--searchInput-radius": "0px",
    "--searchInput-color": "82, 168, 236",
    "--font-primary-color": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.text.color.default")
    ),
    //"--font-primary": "WPP-Regular",
    "--font-primary": wppThemeDataL.font.family,
    "--font-primary-light": wppThemeDataL.font.family,
    "--font-primary-bold": wppThemeDataL.font.family,
    "--color-trackcard-showall": "#00adef15",

    "--color-bubbletag-tonality-bg": wppThemeDataL.color.dataviz.cat.light[1],
    "--color-bubbletag-feelings-bg": wppThemeDataL.color.dataviz.cat.light[2],

    "--color-bubbletag-impact-bg": wppThemeDataL.color.dataviz.cat.light[4],
    "--color-bubbletag-motion-bg": wppThemeDataL.color.dataviz.cat.light[5],
    "--color-bubbletag-instrument-bg": wppThemeDataL.color.dataviz.cat.light[6],
    "--color-bubbletag-usedIn-bg": wppThemeDataL.color.dataviz.cat.light[7],
    "--color-bubbletag-key-bg": wppThemeDataL.color.dataviz.cat.light[8],

    "--color-bubbletag-tonality-text": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.text.color.default")
    ),
    "--color-bubbletag-feelings-text": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.text.color.default")
    ),

    "--color-bubbletag-amp_allmood_ids-bg":
      themeColor?.primary?.[400] || wppThemeDataL.color.primary[400],
    "--color-bubbletag-amp_mainmood_ids-bg":
      themeColor?.primary?.[400] || wppThemeDataL.color.primary[400],
    "--color-bubbletag-asset_type_ids-bg":
      themeColor?.primary?.[100] || wppThemeDataL.color.primary[100],
    "--color-bubbletag-genre-bg":
      themeColor?.primary?.[300] || wppThemeDataL.color.primary[300],
    "--color-bubbletag-tempo-bg":
      themeColor?.primary?.[200] || wppThemeDataL.color.primary[200],
    "--color-bubbletag-soniclogo_mainmood_ids-bg":
      themeColor?.primary?.[400] || wppThemeDataL.color.primary[400],

    "--color-bubbletag-amp_mainmood_ids-text":
      themeColor?.grey?.[300] || wppThemeDataL.color.grey[300],

    "--color-bubbletag-genre-text": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.text.color.default")
    ),
    "--color-bubbletag-tempo-text": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.text.color.default")
    ),
    "--color-bubbletag-soniclogo_mainmood_ids-text": _.get(
      wppThemeDataL,
      _.get(wppThemeData, "content.light.text.color.default")
    ),

    "--color-overtimechart-1": wppThemeDataL.color.dataviz.cat.light[1],
    "--color-overtimechart-2": wppThemeDataL.color.dataviz.cat.light[2],
    "--color-overtimechart-3": wppThemeDataL.color.dataviz.cat.light[3],
    "--color-overtimechart-4": wppThemeDataL.color.dataviz.cat.light[4],
    "--color-overtimechart-5": wppThemeDataL.color.dataviz.cat.light[5],
    "--color-overtimechart-6": wppThemeDataL.color.dataviz.cat.light[6],
    "--color-overtimechart-7": wppThemeDataL.color.dataviz.cat.light[7],
    "--color-overtimechart-8": wppThemeDataL.color.dataviz.cat.light[8],
    "--color-overtimechart-9": wppThemeDataL.color.dataviz.cat.light[9],
    "--color-overtimechart-10": wppThemeDataL.color.dataviz.cat.light[10],
    "--color-overtimechart-11": wppThemeDataL.color.dataviz.cat.neutral[1],
    "--color-overtimechart-12": wppThemeDataL.color.dataviz.cat.neutral[2],
    "--color-overtimechart-13": wppThemeDataL.color.dataviz.cat.neutral[3],
    "--color-overtimechart-14": wppThemeDataL.color.dataviz.cat.neutral[4],
    "--color-overtimechart-15": wppThemeDataL.color.dataviz.cat.neutral[5],
    "--color-overtimechart-16": wppThemeDataL.color.dataviz.cat.neutral[6],
    "--color-overtimechart-17": wppThemeDataL.color.dataviz.cat.neutral[7],
    "--color-overtimechart-18": wppThemeDataL.color.dataviz.cat.neutral[8],
    "--color-overtimechart-19": wppThemeDataL.color.dataviz.cat.neutral[9],
    "--color-overtimechart-20": wppThemeDataL.color.dataviz.cat.neutral[10],

    "--color-radarchart-primary": wppThemeDataL.color.primary[300],

    "--color-piechart-primary": wppThemeDataL.color.dataviz.cat.light[1],
    "--color-piechart-secondary": wppThemeDataL.color.dataviz.cat.light[2],
    "--color-piechart-tertiary": wppThemeDataL.color.dataviz.cat.light[3],
    "--color-piechart-quaternary": wppThemeDataL.color.dataviz.cat.light[4],
    "--color-piechart-quinary": wppThemeDataL.color.dataviz.cat.light[5],
    "--color-piechart-senary": wppThemeDataL.color.dataviz.cat.light[6],

    "--color-footer": wppThemeDataL.color.primary[400],

    "--opacity-bubbletag-tonality": "100",
    "--opacity-bubbletag-feelings": "100",
    "--opacity-bubbletag-genre": "100",

    "--color-register-cancel-btn": "#ed7fad",

    //'--opacity-bubbletag-tonality': '20',
    //'--opacity-bubbletag-feelings': '40',
    //'--opacity-bubbletag-genre': '60'
  };
  return themeObj;
};

export default getWPPThemeJson; */
