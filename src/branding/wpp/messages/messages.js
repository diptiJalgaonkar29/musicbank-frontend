//addition by Trupti-Wits (textual and extra fields)
export default {
  app: {
    document: {
      title: "Sonic Hub",
    },
    footer: {
      main: "All content is registered to Sonic Hub. You have permission to use, combine, change and edit all downloadable content from this platform. For any questions concerning rights management, user profiles and the system itself, please refer to amp sound branding:",
      email: "amp.sonic-os@ampcontact.com",
    },
    common: {
      loading: "Loading",
      loadingWithDashes: "Loading...",
      goBack: "Go Back",
      notFound: "Not Found",
    },
    noMatch: {
      title: "404: Page not Found.",
      body: "The page you're looking for can't be found.",
      goBack: "Go Back",
    },
  },
  navbar: {
    navItems: {
      supersearch: "Keyword",
      projects: "Projects",
      search: "Sonic Hub Home",
      searchMenu: "Search",
      browse: "Browse",
      SimilaritySearch: "Reference Track",
      creationStation: "Creation Station (AI)",
      voice: "Voice",
      myMusic: "Playlists",
      reportEnquiry: "Report / Enquiry",
      documents: "Guidelines",
      documentsReport: "Support",
      logout: "Logout",
      downloadCart: "Download queue",
      profile: "Profile",
    },
  },
  home: {
    page: {
      titleMain: " ",
      titleSub: "Welcome to Sonic Hub",
      titleSubtext: "Welcome to",
      titleSubtextHighlight: "Sonic Hub",
      titleSubtextTail: " ",
      titleSubtextSmall: "Discover music!",
      recently: "Recently Added",
      gotoSuperSearchFooterStart: " ",
      gotoSuperSearchFooterHighlight: "Super Search ",
      gotoSuperSearchFooterEnd: "to find even more goodness.",
    },
    search: {
      browseAll: "Browse All",
    },
  },
  supersearch: {
    page: {
      titleMain: " ",
      titleSub: "Welcome to Sonic Hub",
      titleSubtext: "Welcome to ",
      titleSubtextHighlight: "Super Search",
      titleSubtextSmall: "Pick a tag or a tag combination to find your tracks",
      recently: "Recently Added",
      gotoSuperSearchFooterStart: "Go to the ",
      gotoSuperSearchFooterHighlight: "Super Search: ",
      gotoSuperSearchFooterEnd: "Search by tonality, Genre or Moods",
    },
  },
  auth: {
    login: {
      page: {
        title: "Welcome to Sonic Hub",
        subtitle: " ",
        V3title: "Welcome to",
        V3subtitle: "Sonic Hub",
        subtitleLogin: "Sign in to start your session",
        forgotPassword: "Forgot your password?",
        forgotPasswordMessage: "Forgot your password?",
        forgotPasswordLink: "Click here.",
        email: "Your Email",
        password: "Your Password",
        ssoBtnText: "Login with SSO",
        // emailPlaceholder: "mail@mail.com",
        // passwordPlaceholder: "Type in your password",
        accept: "Login",
        "kc-approve": "kc-approve",
        "kc-reject": "kc-reject",
        "invalid credential": "Invalid credentials",
        "user not found":
          "This account does not exist, please check your email id or sign up.",
        "user not activated": `Your account is not yet activated, you will receive an email upon activation of your account. Please contact <a style="color:var(--color-error)" href="mailto:{{adminEmail}}">{{adminEmail}}</a> in case you did not receive mail within 12 hours.`,
        "blocked user": `Your account has been temporarily blocked. Please contact our support team at <a style="color:var(--color-error)" href="mailto:{{adminEmail}}">{{adminEmail}}</a> to resolve this issue and regain access to your account.`,
        userDisabledForAllBrands: `Your company has been disabled for all brands. Please contact our support team at <a style="color:var(--color-error)" href="mailto:{{adminEmail}}">{{adminEmail}}</a> to resolve this issue and regain access to your account`,
        "deleted user": "Your account has been deleted.",
        "default error": "Something went wrong",
        "sso user":
          "Your account is registered with SSO. Please log in using SSO.",
        "approved user":
          "Your account is approved, please check your mail to set your password or click on Forget password to set your password.",
      },
    },
    register: {
      registerhere: "Please fill this form",
      registerSuccess: "Thank you for your registration!",
      access: "To request access for Sonic Hub",
    },
    recoverPassword: {
      page: {
        title: "Enter your email or username",
        subtitle: "We'll send you a link to reset your password",
        resetPassword: "Reset Password",
        email: "Your Email",
        error: "Something went wrong",
        "blocked user": `Your account has been temporarily blocked. Please contact our support team at <a style="color:var(--color-error)" href="mailto:{{adminEmail}}">{{adminEmail}}</a> to resolve this issue and regain access to your account.`,
        success: "Please check your email.",
        accept: "Reset Password",
        "user not found":
          "This account does not exist, please check your email id.",
        "sso user":
          "Your account is registered with SSO. Unable to recover password.",
      },
    },
    verifyMFA: {
      page: {
        qrCodeTitle: "Scan the QR Code",
        qrCodeSubtitle: "Use an authenticator app to scan",
        OTPTitle: "Verify your sign in",
        OTPSubtitle: "Enter your code from the app",
        defaultError: "Something went wrong",
      },
    },
    setPassword: {
      page: {
        title: "Set Your Password",
        subtitle: "To get access to the Sonic Hub",
        error: "Something went wrong",
        success: "Password updated successfully, redirecting to login page.",
        linkExpiredMsg:
          "Your link has expired, please try the forgot password.",
      },
    },
    acceptanceWindow: {
      first: "I have read and accept the",
      middle: "Terms of Use",
      last: "Terms of Use.",
    },
    SSAndCSAccessDenied: {
      page: {
        message:
          "Access to Sonic Hub and Creation Station has been denied. Please contact the administrator for assistance.",
      },
    },
  },
  results: {
    page: {
      resultsFor: "Results for : ",
      noResults: "No results",
    },
    newSearch: {
      title: "New Search",
      button: "New Search",
      decline: "Close",
    },
  },

  playlist: {
    page: {
      createNew: "New Playlist",
      noPlaylist: "No Playlists yet, add new playlist",
      noTracks: "No Tracks Added to the Playlist yet",
      notExists: "Playlist doesn't exist.",
    },
    create: {
      title: "Create New Playlist",
      nameInputTitle: "Name*",
      nameInputPlaceHolder: "My new Playlist",
      descriptionInputTitle: "Description",
      descriptionInputPlaceHolder: "Enter a Description for your Playlist",
      coverImageInputTitle: "Cover Image",
      coverImageInputPlaceHolder: "Select cover image",
      accept: "Create",
      decline: "Cancel",
    },
    remove: {
      title: "Are you sure to delete this Playlist ?",
      deleteTrack: "Delete from Playlist",
      accept: "Delete",
      decline: "Cancel",
    },
    member: {
      titleOne: "Member",
      titleMore: "Members",
      invite: "Invite Member to Playlist",
      inviteAccept: "Invite",
      updateShareLink: "Update validity",
      inviteDecline: "Cancel",
      ok: "Ok",
      selected: "selected",
      more: "Show All",
      showAll: "Show All",
      noMember: "No Member",
      accept: "Remove",
      decline: "Close",
      memberModalTitle: "Registered Members Overview",
      memberModalTitleGuest: "External Members Overview",
    },

    extra: {
      deletePlaylist: "Delete Playlist",
      sharePlaylist: "Share Playlist - Registered Users",
      sharePlaylistExternal: "Share Playlist - External Users",
      invalidlink: "Sorry, the link is expired!",
    },
    comment: {
      newMessageInputPlaceholder: "Type your Message",
      deleteQuestion: "Delete this Comment ?",
      deleteAccept: "Delete",
      editedMessage: "edited",
      editAccept: "Save",
      editDecline: "Cancel",
      accept: "Comment",
      titleOne: "Comment",
      titleMore: "Comments",
    },
  },
  browse: {
    page: {
      recently: "Recently Added",
      popular: "Popular",
      curated: "Curated Playlist",
    },
  },
  profile: {
    page: {
      profilePageTitle: "Edit profile",
      nameLabel: "Name",
      emailLabel: "Email Address",
      MFAConfigureTitle: "2FA authentication",
      MFAConfigureDesc:
        "Use Authenticator app to get two-factor authentication codes",
      changePasswordTitle: "Change password",
      currentPasswordLabel: "Current password",
      newPasswordLabel: "New password",
      confirmPasswordLabel: "Confirm Password",
    },
  },
  trackDetail: {
    page: {
      downloadMP3: "Download MP3",
      downloadSTEMS: "Download STEMS",
      downloadWAV: "Download WAV",
      similarTRACKS: "Similar TRACKS",
      masterTitle: "MASTER:",
      editTitleOne: "EDIT",
      editTitleMore: "EDITS",
      getWAV: "Get WAV",
      getSTEMS: "Get STEMS",
      notExists: "Track doesn't exist.",
    },
    dowloadWAV: {
      title: "Please provide some information",

      userInformationTitle: "User Information:*",
      advertisingTitle: "Advertising Agency:",
      productionTitle: "Production Company:",

      topicInputTitle: "Product name/Topic Name:",
      topicInputPlaceholder: "Product / Topic",

      campainInputTitle: "Campaign Name:",
      campainInputPlaceholder: "Campaign",

      formatInputTitle: "Type of Content:",
      formatInputPlaceholder: "Productfilm / Designfilm / Snippets",

      durationsInputTitle: "Durations:",
      durationsInputPlaceholder: "2x 60 / 2x 15s",

      firstAiringInputTitle: "First Airing:",
      firstAiringInputPlaceholder: "DD.MM.YYYY",

      advertisingAgencyInputTitle: "Advertising Agency/ Production Company:",
      advertisingAgencyInputTitleInputPlaceholder: "Agency Name",

      producerNameInputTitle: "Producer Name:",
      producerNameInputPlaceholder: "...",

      IDNumberInputTitle: "ID Number:",
      IDNumberInputPlaceholder: "Competitrack Code / Clock Number",

      productionCompanyInputTitle: "Production Company:",
      productionCompanyInputPlaceholder: "Company Name",

      producerEmailInputTitle: "Contact Email Address:",
      producerEmailInputPlaceholder: "Contact Email Address",

      countryNameInputTitle: "Select Country:",
      countryNameInputPlaceholder: "Country Name",

      airingmonthInputTitle: "Airing Month:",
      airingmonthInputPlaceholder: "Airing Month (mmyy)",

      saveAsDraftCartBtn: "Save to draft",
      downloadCartBtn: "Download",

      selectMediaTypeInputTitle: "Select the Airing Media:",
      traditionalMediaTypeInputTitle: "Traditional:",
      digitalMediaTypeInputTitle: "Digital:",

      accept: "Download",
    },
  },
};
