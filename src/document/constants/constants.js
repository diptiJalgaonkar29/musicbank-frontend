import { v4 as uuidv4 } from "uuid";

export const Consumer = (showReport) => {
  return [
    {
      id: uuidv4(),
      route: "Report",
      label: "Report / Enquiry",
      isFetchData: false,
      isVisible: showReport,
    },
    {
      id: uuidv4(),
      route: "Guidelines",
      label: "Guidelines",
      isFetchData: true,
      isVisible: true,
    },
    {
      id: uuidv4(),
      route: "Templates",
      label: "Templates",
      isFetchData: true,
      isVisible: true,
    },
    {
      id: uuidv4(),
      route: "FAQ",
      label: "FAQ",
      isFetchData: true,
      isVisible: true,
    },
  ];
};

export const categories = [
  {
    id: uuidv4(),
    route: "Report",
    label: "Report / Enquiry",
    isFetchData: false,
    isVisible: true,
  },
  {
    id: uuidv4(),
    route: "Guidelines",
    label: "Guidelines",
    isFetchData: true,
    isVisible: true,
  },
  {
    id: uuidv4(),
    route: "Templates",
    label: "Templates",
    isFetchData: true,
    isVisible: true,
  },
  {
    id: uuidv4(),
    route: "FAQ",
    label: "FAQ",
    isFetchData: true,
    isVisible: true,
  },
];

export const baseUrlPDF = `api/files/${process.env.REACT_APP_API_PATH_DOCUMENTS}`;
export const baseUrlDocImg = `api/files/${process.env.REACT_APP_API_PATH_DOCUMENT_PICTURES}/`;

/* FOOTER */

export const PRIVACY_POLICY = "Privacy Policy";
export const TERMS_OF_USE = "Terms of Use";
export const DISCLAIMER = "Disclaimer";

/* Routes */

export const PRIVACY_POLICY_ROUTE = "/privacy-policy/";
export const TERMS_AND_CONDITIONS_ROUTE = "/terms-of-use/";
export const DISCLAIMER_ROUTE = "/disclaimer/";
export const COOKIE_STATEMENT_ROUTE = "/cookie-statement/";
