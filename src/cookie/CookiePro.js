const otCcpaScript = document.createElement("script");
const script1 = document.getElementsByTagName("script")[0];
// console.log('script cookiepro',script1);
otCcpaScript.src =
  "https://cookie-cdn.cookiepro.com/ccpa-optout-solution/v1/ccpa-optout.js";
otCcpaScript.async = false;
otCcpaScript.type = "text/javascript";
script1.parentNode.insertBefore(otCcpaScript, script1);
window.otccpaooSettings = {
  layout: {
    dialogueLocation: "right",
    primaryColor: "#6aaae4",
    secondaryColor: "#ffffff",
    button: {
      primary: "#6aaae4",
      secondary: "#ffffff",
    },
  },
  dialogue: {
    email: {
      display: false,
      title: "",
      url: "",
    },
    lspa: {
      accepted: false,
    },
    phone: {
      display: false,
      title: "",
      url: "",
    },
    dsar: {
      display: false,
      title: "",
      url: "",
    },
    intro: {
      title: "Do Not Sell My Personal Information",
      description: "Exercise your consumer right to opt out.",
    },
    privacyPolicy: {
      title: "",
      url: "",
    },
    optOut: {
      title: "Personalized Advertisements",
      description:
        "Turning this off will opt you out of personalized advertisements on this website.",
      frameworks: ["iab", "gam"],
    },
    location: "us",
    confirmation: {
      text: "Confirm",
    },
  },
};
document.head.appendChild(script1);
