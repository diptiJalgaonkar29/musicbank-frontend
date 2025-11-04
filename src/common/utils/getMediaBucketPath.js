
//MP3,WAV,StemZip = demo-mastercard-encrypted-sonichub
//Images  = demo-mastercard-common-sonichub
//Preview = demo-mastercard-preview-sonichub

//demo-amp-encrypted-sonichub
//demo-amp-signed-sonichub
//demo-amp-common-sonichub
//demo-amp-preview-sonichub

//mp3_track ,stems_zip,wav_track = https://storage.googleapis.com/strotswar-tracks-storage/
//detail_image,preview_image, wave_form_js ,all images = https://storage.googleapis.com/strotswar-images-storage/

//"REACT_APP_STORAGE_BASEPATH": "https://storage.googleapis.com/",
//    "REACT_APP_PATH_ENV": "demo",
//  "REACT_APP_STORAGE_IMGPATH_STROTSWAR": "strotswar-images-storage",
// "REACT_APP_STORAGE_IMGPATH_BRAND_POSTFIX": "common-sonichub",    
//  "REACT_APP_STORAGE_IMGPATH_BRAND_SAMPLE": "demo-mastercard-common-sonichub"

//https://storage.googleapis.com/strotswar-images-storage/trackimages/Before_And_After_20250819_161617_thumb.webp
//https://storage.googleapis.com/demo-mastercard-common-sonichub/trackimages/Pride_Anthem_2022_20250823_111836_thumb.webp
//https://storage.googleapis.com/demo-mastercard-common-sonichub/trackimages/Tick_Tock_20250823_112643_thumb.webp
//https://storage.googleapis.com/demo-mastercard-common-sonichub/trackimages/Tick_Tock_20250823_112643_thumb.webp


//previewImageUrl = hit?.source_id == 1 ? process.env.REACT_APP_STORAGE_BASEPATH + process.env.REACT_APP_STORAGE_IMGPATH_STROTSWAR + hit?.preview_image :
//    process.env.REACT_APP_STORAGE_BASEPATH + process.env.REACT_APP_PATH_ENV + "-" + brandPrefix + "-" + process.env.REACT_APP_STORAGE_IMGPATH_BRAND_POSTFIX + hit?.preview_image;


const getMediaBucketPath = (path, mediaProviderId, fileType) => {
    //console.log("getMediaBucketPath -- Input Params:", path)
    //console.log("getMediaBucketPath -- mediaProviderId Params:", mediaProviderId)
    //console.log("getMediaBucketPath -- fileType Params:", fileType)
    /* if (path == null || path === undefined || path === '') {
        console.warn("Invalid path provided");
        return '';
    } */

    let basePath = process.env.REACT_APP_STORAGE_BASEPATH || '';
    let brandPrefix = window.globalConfig.BRAND_NAME_MEDIA_PATH_PREFIX;
    let updatedMediaPath = '';

    const base = "https://storage.googleapis.com/strotswar-images-storage/";
    const firstIndex = path?.indexOf(base) || "";

    switch (fileType) {
        case 'image':
            if (mediaProviderId === 1) {
                updatedMediaPath = basePath + process.env.REACT_APP_STORAGE_IMGPATH_STROTSWAR + path;
            }
            else {
                updatedMediaPath = basePath + process.env.REACT_APP_PATH_ENV + "-" + brandPrefix + "-" + process.env.REACT_APP_STORAGE_IMGPATH_BRAND_POSTFIX + path;
            }
            break;
        case 'waveform':
            if (!path || !mediaProviderId) {
                updatedMediaPath = `${document.location.origin}/brandassets/common/js/57508207-2.js`;
                //console.log("called_+++++++++++021", `${document.location.origin}/brandassets/common/js/57508207-2.js`)
            }
            else if (mediaProviderId === 1) {
                if (firstIndex !== -1) {
                    const cleaned = base + path.slice(firstIndex + base.length);
                    updatedMediaPath = cleaned;
                    //console.log("called_+++++++++++1", cleaned)
                } else {
                    updatedMediaPath = basePath + process.env.REACT_APP_STORAGE_IMGPATH_STROTSWAR + path;
                    //console.log("called_+++++++++++10", basePath + process.env.REACT_APP_STORAGE_IMGPATH_STROTSWAR + path)
                }
            } else {
                updatedMediaPath = basePath + process.env.REACT_APP_PATH_ENV + "-" + brandPrefix + "-" + process.env.REACT_APP_STORAGE_PREVIEWPATH_BRAND_POSTFIX + path;
                //console.log("called_+++++++++++12", basePath + process.env.REACT_APP_PATH_ENV + "-" + brandPrefix + "-" + process.env.REACT_APP_STORAGE_PREVIEWPATH_BRAND_POSTFIX + path)
            }
            break;

        case 'waveformjsdata':
            //console.log("getMediaBucketPath -- waveformjsdata:", path)
            if (path === null || path === undefined || path === '' || path === 'null') {
                updatedMediaPath = `${document.location.origin}/brandassets/common/js/57508207-2.js`;
            }
            else {
                if (mediaProviderId === 1) {
                    updatedMediaPath = basePath + process.env.REACT_APP_STORAGE_IMGPATH_STROTSWAR + path;
                    //local testing-updatedMediaPath = "/" + process.env.REACT_APP_STORAGE_IMGPATH_STROTSWAR + path;
                    //console.log("called_+++++++++++10", basePath + process.env.REACT_APP_STORAGE_IMGPATH_STROTSWAR + path)
                } else {
                    updatedMediaPath = basePath + process.env.REACT_APP_PATH_ENV + "-" + brandPrefix + "-" + process.env.REACT_APP_STORAGE_PREVIEWPATH_BRAND_POSTFIX + path;
                    //local testing -updatedMediaPath = "/" + process.env.REACT_APP_PATH_ENV + "-" + brandPrefix + "-" + process.env.REACT_APP_STORAGE_PREVIEWPATH_BRAND_POSTFIX + path;
                    //console.log("called_+++++++++++12", basePath + process.env.REACT_APP_PATH_ENV + "-" + brandPrefix + "-" + process.env.REACT_APP_STORAGE_PREVIEWPATH_BRAND_POSTFIX + path)
                }
            }
            //console.log("getMediaBucketPath -- waveformjsdata:updatedMediaPath", updatedMediaPath)
            break;
        case 'download':
            if (mediaProviderId === 1) {
                updatedMediaPath = basePath + process.env.REACT_APP_STORAGE_DOWNLOADPATH_STROTSWAR + path;
            }
            else {
                updatedMediaPath = basePath + process.env.REACT_APP_PATH_ENV + "-" + brandPrefix + "-" + process.env.REACT_APP_STORAGE_DOWNLOADPATH_BRAND_POSTFIX + path;
            }
            break;
        default:
            throw new Error('Invalid file type');
    }
    // console.log("getMediaBucketPath -- Updated Media Path:", fileType, updatedMediaPath);
    return updatedMediaPath;
};

export default getMediaBucketPath;

//MP3,WAV,StemZip = demo-mastercard-encrypted-sonichub
//Images  = demo-mastercard-common-sonichub
//Preview = demo-mastercard-preview-sonichub

//demo-amp-encrypted-sonichub
//demo-amp-signed-sonichub
//demo-amp-common-sonichub
//demo-amp-preview-sonichub

//mp3_track ,stems_zip,wav_track = https://storage.googleapis.com/strotswar-tracks-storage/
//detail_image,preview_image, wave_form_js ,all images = https://storage.googleapis.com/strotswar-images-storage/
