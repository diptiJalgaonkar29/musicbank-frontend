function addGa4TagTest() {
  //  Google Tag Manager library
  var scriptGA3 = document.createElement("script");
  scriptGA3.async = true;
  scriptGA3.src = "https://www.googletagmanager.com/gtag/js?id=G-D8V213LC4D";
  document.head.appendChild(scriptGA3);

  // Google Tag Manager configuration
  var scriptGA4 = document.createElement("script");
  scriptGA4.type = "text/javascript";
  scriptGA4.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-D8V213LC4D');
      `;
  document.head.appendChild(scriptGA4);
}

addGa4TagTest();

//This is Test code for Docunet Title and  GA handling

window.onload = function () {
  // console.log("page loaded ", window.location.hash);
  //observeUrlChange();
};

const observeUrlChange = () => {
  let oldHref = document.location.href;
  const body = document.querySelector("body");
  const observer = new MutationObserver((mutations) => {
    // console.log("page loaded - change ", document.location.hash);
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      setTimeout(() => {
        applyDocumentTitle();
      }, 600);
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

const applyDocumentTitle = () => {
  // console.log("window", document.location.hash);
  let pageTitle = "Home";
  let pageHash = document.location.hash;
  //let brandNameTitle = " | "+this.capitalizeFirstLetterBrand(getSuperBrandName())
  let brandNameTitle = " | Mastercard Sonic Hub";
  switch (pageHash) {
    case "#/login":
      pageTitle = "Login";
      break;
    case "#/":
      pageTitle = "Home";
      break;
    case "#/recover-password":
      pageTitle = "Recover Password";
      break;
    case "#/wpp-design":
      pageTitle = "WPP Design Page";
      break;
    case "#/register":
      pageTitle = "Register";
      break;
    case "#/set-password":
      pageTitle = "Set Password";
      break;
    case "#/profile":
      pageTitle = "User Profile";
      break;
    case (pageHash.match(/^#\/search_results/) || {}).input:
      pageTitle = "Search";
      break;
    case "#/browse":
      pageTitle = "Browse";
      break;
    case (pageHash.match(/^#\/mymusic/) || {}).input:
      pageTitle = "My Music";
      break;
    case (pageHash.match(/^#\/track_page/) || {}).input:
      pageTitle = "Track Details";
      break;
    case "#/supersearch/":
      pageTitle = "SuperSearch";
      break;
    case (pageHash.match(/^#\/similar_tracks/) || {}).input:
      pageTitle = "Similarity Search";
      break;
    case "#/documents/guidelines":
      pageTitle = "Guidelines";
      break;
    case "#/documents/templates":
      pageTitle = "Templates";
      break;
    case "#/documents/faq":
      pageTitle = "FAQ";
      break;
    case "#/basket/":
      pageTitle = "Basket";
      break;
    case "#/download_basket_form/":
      pageTitle = "Download Form";
      break;
  }
  document.title = pageTitle + brandNameTitle;
};

//observeUrlChange();
//applyDocumentTitle();

function addGTMTagTest() {
  //this is for mastercard
  var scriptGA5 = document.createElement("script");
  scriptGA5.type = "text/javascript";
  scriptGA5.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-P4FZ2G4D');`;
  document.head.append(scriptGA5);

  var scriptGA6 = document.createElement("noscript");
  scriptGA6.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P4FZ2G4D"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.append(scriptGA6);
}

//addGTMTagTest();
