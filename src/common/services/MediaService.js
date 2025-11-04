import axios from "axios";
import AsyncService from "../../networking/services/AsyncService";
import getSuperBrandId from "../utils/getSuperBrandId";

const isDevelopmentMode = process.env.NODE_ENV === "development";

class MediaService {
  constructor(asyncService) {
    this.asyncService = asyncService;
  }

  // getImage(name) {
  //   let url = `/files/${process.env.REACT_APP_API_PATH_PICTURES}/${name}`;
  //   if (isDevelopmentMode)
  //     url = `/files/${process.env.REACT_APP_API_PATH_PICTURES}/MB_EyeOfTheStorm_AlbumCover_300.png`;

  //   return this.asyncService.loadBlob(url).then(function (res) {
  //     return URL.createObjectURL(res.data);
  //   });
  // }
  getImage(name) {
    let url = `/files/${process.env.REACT_APP_API_PATH_PICTURES}/${name}`;

    // Keep development override
    if (isDevelopmentMode) {
      url = `/files/${process.env.REACT_APP_API_PATH_PICTURES}/MB_EyeOfTheStorm_AlbumCover_300.png`;
    }

    return this.asyncService
      .loadBlob(url)
      .then((res) => {
        // If blob is valid, return object URL
        return URL.createObjectURL(res.data);
      })
      .catch((err) => {
        console.warn("Image load failed, using fallback image:", err);

        // Fallback only if not already in development mode
        const fallbackUrl = `/files/${process.env.REACT_APP_API_PATH_PICTURES}/MB_EyeOfTheStorm_AlbumCover_300.png`;
        return this.asyncService
          .loadBlob(fallbackUrl)
          .then((fallbackRes) => URL.createObjectURL(fallbackRes.data))
          .catch((fallbackErr) => {
            console.error("Fallback image load also failed:", fallbackErr);
            return null; // Optional: or return a data URI or placeholder
          });
      });
  }

  getCustomTrackVisualAsset(name, id) {
    let url = `/customtracks/getFile/${id}/${name}`;
    return this.asyncService.loadBlob(url).then(function (res) {
      return URL.createObjectURL(res.data);
    });
  }

  getImagePlaylist(name) {
    let url = `/files/${process.env.REACT_APP_API_PATH_PICTURES_PLAYLIST}/${name}`;
    // if (isDevelopmentMode)
    //   url = `/files/${process.env.REACT_APP_API_PATH_PICTURES_PLAYLIST}/coverpicture1.jpg`;

    // console.log('getImage ' + name + '|' + url);

    return this.asyncService.loadBlob(url).then(function (res) {
      return URL.createObjectURL(res.data);
    });
  }

  getImageUnregistered(name, mCode) {
    let url = `files/${process.env.REACT_APP_API_PATH_PICTURES_UNREGISTERED}/${name}`;
    if (isDevelopmentMode)
      url = `files/${process.env.REACT_APP_API_PATH_PICTURES_UNREGISTERED}/MB_EyeOfTheStorm_AlbumCover_300.png`;

    let mCodeValidateFor = JSON.stringify({ mcode: mCode });
    let config = {
      method: "POST",
      url: url,
      data: mCodeValidateFor,
      headerConfig: {
        headers: {
          "Content-Type": "application/json",
          BrandName: getSuperBrandId(),
          BrandId: localStorage.getItem("brandId"),
        },
        responseType: "blob",
      },
    };
    return this.asyncService.loadBlobUnregistered(config).then(function (res) {
      let blob = new Blob([res.data], { type: res.headers["Content-Type"] });
      return URL.createObjectURL(blob);
    });
  }

  getDocumentImage(name) {
    let url = `/files/${process.env.REACT_APP_API_PATH_DOCUMENT_PICTURES}/${name}`;

    if (isDevelopmentMode)
      url = `/files/${process.env.REACT_APP_API_PATH_DOCUMENT_PICTURES}/MC_SONIC_USER_GUIDE_092019_FINAL.jpg`;

    return this.asyncService
      .loadBlob(url)
      .then((res) => URL.createObjectURL(res.data));
  }

  // getWaveform(name) {
  //   let url = `/files/${process.env.REACT_APP_API_PATH_WAVEFORMS}/${name}.png`;
  //   if (isDevelopmentMode)
  //     url = `/files/${process.env.REACT_APP_API_PATH_WAVEFORMS}/MB_AudioMASTER_ComeAlive_0dBfs.mp3.png`;

  //   return this.asyncService
  //     .loadBlob(url)
  //     .then((res) => URL.createObjectURL(res.data));
  // }
  getWaveform(name) {
    let url = `/files/${process.env.REACT_APP_API_PATH_WAVEFORMS}/${name}.png`;

    // Keep dev override
    if (isDevelopmentMode) {
      url = `/files/${process.env.REACT_APP_API_PATH_WAVEFORMS}/MB_AudioMASTER_ComeAlive_0dBfs.mp3.png`;
    }

    return this.asyncService
      .loadBlob(url)
      .then((res) => URL.createObjectURL(res.data))
      .catch((err) => {
        console.warn("Waveform load failed, using fallback waveform:", err);

        // Fallback only if not already in dev mode
        const fallbackUrl = `/files/${process.env.REACT_APP_API_PATH_WAVEFORMS}/MB_AudioMASTER_ComeAlive_0dBfs.mp3.png`;
        return this.asyncService
          .loadBlob(fallbackUrl)
          .then((fallbackRes) => URL.createObjectURL(fallbackRes.data))
          .catch((fallbackErr) => {
            console.error("Fallback waveform load also failed:", fallbackErr);
            return null;
          });
      });
  }

  getWaveformUnregistered(name, mCode) {
    let url = `files/${process.env.REACT_APP_API_PATH_WAVEFORMS_UNREGISTERED}/${name}.png`;
    if (isDevelopmentMode)
      url = `files/${process.env.REACT_APP_API_PATH_WAVEFORMS_UNREGISTERED}/MB_AudioMASTER_PartnerInCrime_PillowSnippet_0dBFS.mp3.png`;

    let mCodeValidateFor = JSON.stringify({ mcode: mCode });
    let config = {
      method: "POST",
      url: url,
      data: mCodeValidateFor,
      headerConfig: {
        headers: {
          "Content-Type": "application/json",
          BrandName: getSuperBrandId(),
          BrandId: localStorage.getItem("brandId"),
        },
        responseType: "blob",
      },
    };
    return this.asyncService.loadBlobUnregistered(config).then(function (res) {
      let blob = new Blob([res.data], { type: res.headers["Content-Type"] });
      return URL.createObjectURL(blob);
    });
  }

  getTrackLyrics(name) {
    let url = `/files/${process.env.REACT_APP_API_PATH_TRACK_LYRICS}/${name}`;
    if (isDevelopmentMode)
      url = `/files/${process.env.REACT_APP_API_PATH_TRACK_LYRICS}/378_track_lyrics.txt`;

    return this.asyncService.loadBlob(url).then(async (res) => {
      try {
        let blobText = await res.data.text();
        if (blobText === `{"Status":"Txt File Not Found"}`) {
          // console.log(`${url} => file not found`);
          return null;
        } else {
          return URL.createObjectURL(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  getMp3(name) {
    let url = `/files/${process.env.REACT_APP_API_PATH_MP3S}/${name}`;
    if (isDevelopmentMode)
      url = `/files/${process.env.REACT_APP_API_PATH_MP3S}/MB_AudioMASTER_ComeAlive_0dBfs.mp3`;

    return this.asyncService
      .loadBlob(url)
      .then((res) => URL.createObjectURL(res.data));
  }
  /* 
  getStroswarTokenForPreview() {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://librarytracks.sonic-hub.com/api/Token?apiKey=18FBA80F-A5DE-4D45-A96F-970DAA069A37',
      headers: {
        'accept': '/'
      }
    };

    return axios.request(config)
      .then((response) => {
        //console.log("getStroswarTokenForPreview- Received preview token:", response.data.accessToken);
        return response.data.accessToken;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  getMp3FromStroswarTest(id) {
    return this.getStroswarTokenForPreview().then((previewToken) => {
      console.log("getStroswarTokenForPreview- Received preview token:", previewToken);
      if (!previewToken) {
        console.error("No preview token received");
        return null;
      }

      const data = JSON.stringify({ "StrotSwarID": id });
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://librarytracks.sonic-hub.com/api/Voice/getaudiofile',
        headers: {
          'accept': '/',
          'Authorization': 'Bearer ' + previewToken,
          'Content-Type': 'application/json'
        },
        responseType: 'blob',
        data: data
      };

      return axios.request(config)
        .then((response) => {
          // Return object URL for the blob
          console.log("getMp3FromStroswar- Received MP3 data:", response.data);
          return URL.createObjectURL(response.data);
        })
        .catch((error) => {
          console.error(error);
          return null;
        });
    });
  } */

  getMp3FromStroswar(id, track_mediatypes, track_type_id) {
    let payload = {};
    let previewAvailable = false;

    //track_type_id - 4: On-Demand Library, 5: On-request

    if (
      (track_mediatypes && track_mediatypes.includes("preview")) ||
      (track_type_id && (track_type_id == 5 || track_type_id == 6))
    ) {
      previewAvailable = true;
    }

    //adding this, as on play we will play normal track irrespecitve of preview available. Preview is only for downnload preview button
    //this is a change in logic give later, so we add static false here.
    //we will update in case we get any other logic for this - 02092025

    previewAvailable = false;

    if (previewAvailable) {
      payload = {
        strotSwarIDs: id,
        fileType: "4",
        sourceType: "sonic",
      };
    } else {
      payload = {
        strotSwarIDs: [id],
        fileType: "1",
        sourceType: "sonic",
      };
    }

    return this.asyncService
      .loadDataParam("/tracks/getFileData", payload)
      .then((response) => {
        console.log("getFileDataAPI response1", response);
        console.log("getFileDataAPI response2", response.data.status);
        console.log("getFileDataAPI response3", response.data.data);
        if (response.data.status.toLowerCase() !== "success") {
          // Log or handle the error status message
          console.error(
            "getFileDataAPI error:",
            response.data.message || response.data.status
          );
          return null; // Or handle as needed
        }

        //return previewAvailable ? response.data.data:response.data?.data?.[0]?.file?.[0]?.signedUrl;

        if (previewAvailable) {
          const base64Data = response.data.data;

          // Convert base64 to binary data
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);

          // Create a Blob from binary data
          const blob = new Blob([byteArray], { type: "audio/mp3" });
          console.log("AudioPlayerSH2 - Blob--", blob);

          // Create an object URL from the Blob
          const objectUrl = URL.createObjectURL(blob);
          return objectUrl;
        } else {
          return response.data?.data?.[0]?.file?.[0]?.signedUrl;
        }

        // preview resp- return response.data.data;
        //mp3 res- return response.data?.data?.[0]?.file?.[0]?.signedUrl;
      })
      .catch((err) => {
        console.error("getFileDataAPI failed", err);
      });
  }
  getMp3FromStroswarUnRegistered(id, mCode) {
    let payload = {
      strotSwarIDs: [id],
      fileType: "1",
      sourceType: "sonic",
    };

    return this.asyncService
      .loadDataParam(`/tracks/mp3sUnregistered/${mCode}`, payload)

      .then((response) => {
        if (response.data.status.toLowerCase() !== "success") {
          return null; // Or handle as needed
        }

        return response.data?.data?.[0]?.file?.[0]?.signedUrl;
      })
      .catch((err) => {
        console.error("getFileDataAPI failed", err);
      });
  }

  getWav(name) {
    let url = `/files/${process.env.REACT_APP_API_PATH_WAVS}/${name}`;
    if (isDevelopmentMode)
      url = `/files/${process.env.REACT_APP_API_PATH_WAVS}/MB_AudioMASTER_ComeAlive_0dBfs.wav`;
    return this.asyncService
      .loadBlob(url)
      .then((res) => URL.createObjectURL(res.data));
  }

  getWavForTrim(name) {
    let url = `/files/${process.env.REACT_APP_API_PATH_WAVS}/${name}`;
    if (isDevelopmentMode)
      url = `/files/${process.env.REACT_APP_API_PATH_WAVS}/MB_AudioMASTER_ComeAlive_0dBfs.wav`;
    return this.asyncService.loadBlob(url).then((res) => {
      // console.log("res", res);
      if (res.data.type === "application/json") {
        // res.data.text().then((a) => {
        //   let b = JSON.parse(a);
        //   console.log("b", b);
        // });
        return null;
      }

      return URL.createObjectURL(res.data);
    });
  }

  getStem(name) {
    let url = `/files/${process.env.REACT_APP_API_PATH_WAV_STEMS}/${name}`;
    if (isDevelopmentMode)
      url = `/files/${process.env.REACT_APP_API_PATH_WAV_STEMS}/MB_AudioMASTER_MeBeToo_Orchestral__STEMS.zip`;
    return this.asyncService
      .loadBlob(url)
      .then((res) => URL.createObjectURL(res.data));
  }

  getMp3Unregistered(name, mCode) {
    let url = `files/${process.env.REACT_APP_API_PATH_MP3S_UNREGISTERED}/${name}`;
    if (isDevelopmentMode)
      url = `files/${process.env.REACT_APP_API_PATH_MP3S_UNREGISTERED}/MB_AudioMASTER_AllWeAreAfter_AllAround_Instr_0dBFS.mp3`;
    let mCodeValidateFor = JSON.stringify({ mcode: mCode });
    let config = {
      method: "POST",
      url: url,
      data: mCodeValidateFor,
      headerConfig: {
        headers: {
          "Content-Type": "application/json",
          BrandName: getSuperBrandId(),
          BrandId: localStorage.getItem("brandId"),
        },
        responseType: "blob",
      },
    };
    return this.asyncService.loadBlobUnregistered(config).then(function (res) {
      let blob = new Blob([res.data], { type: res.headers["content-type"] });
      // console.log(blob,'blobData')
      return URL.createObjectURL(blob);
    });
  }

  getEmbeddedMediaInfo(vPath) {
    let videoType = null;
    let videoID = null;
    let embedUrl = null;

    try {
      if (!vPath || typeof vPath !== "string" || !vPath.startsWith("http")) {
        throw new Error("Invalid or missing URL string");
      }

      const url = new URL(vPath);

      if (
        url.hostname.includes("youtube.com") ||
        url.hostname.includes("youtu.be") ||
        url.hostname.includes("music.youtube.com")
      ) {
        videoType = "youtube";
        if (url.searchParams.has("v")) {
          videoID = url.searchParams.get("v");
        }
        if (!videoID && url.hostname.includes("youtu.be")) {
          videoID = url.pathname.split("/")[1];
        }
        if (!videoID && url.pathname.includes("/embed/")) {
          videoID = url.pathname.split("/embed/")[1];
        }
        if (!videoID && url.pathname.includes("/shorts/")) {
          videoID = url.pathname.split("/shorts/")[1];
        }
        if (videoID) {
          embedUrl = `https://www.youtube.com/embed/${videoID}`;
        }
      }

      // Vimeo
      else if (url.hostname.includes("vimeo.com")) {
        videoType = "vimeo";
        const parts = url.pathname.split("/");
        videoID = parts.pop() || parts.pop();
        embedUrl = `https://player.vimeo.com/video/${videoID}`;
      }

      // SoundCloud
      else if (url.hostname.includes("soundcloud.com")) {
        videoType = "soundcloud";
        const encoded = encodeURIComponent(vPath);
        embedUrl = `https://w.soundcloud.com/player/?url=${encoded}&color=c0c600&auto_play=false&buying=false&liking=true&download=false&sharing=false&show_artwork=true&show_comments=true&show_playcount=true&show_user=true&hide_related=true&visual=false&start_track=0&callback=true`;
        videoID = encoded;
      }

      return embedUrl ? { videoType, videoID, embedUrl } : null;
    } catch (err) {
      console.error("Error parsing embed URL:", err);
      return null;
    }
  }
}

export default new MediaService(AsyncService);
