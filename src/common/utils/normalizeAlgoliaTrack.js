import getMediaBucketPath from './getMediaBucketPath';

export default function normalizeAlgoliaTrack(hit) {
    if (!hit) return null;

    return {
        objectID: hit?.sonichub_track_id || "",
        trackId: hit?.objectID,
        indexProp: hit?.sonichub_track_id,

        artist_name: hit?.artist || "",
        asset_processed_id: hit?.source_id || "",
        asset_type_id: hit?.asset_type_id?.toString() || "",
        authorgemanumber: "",
        track_mediatypes: hit?.track_mediatypes || [],

        created_at: hit?.lastUpdateDate
            ? new Date(
                hit.lastUpdateDate.slice(4, 8),     // yyyy
                hit.lastUpdateDate.slice(2, 4) - 1, // mm
                hit.lastUpdateDate.slice(0, 2)      // dd
            ).toISOString()
            : null,

        created_at_timestamp: hit?.lastUpdateDate
            ? Math.floor(
                new Date(
                    hit.lastUpdateDate.slice(4, 8),
                    hit.lastUpdateDate.slice(2, 4) - 1,
                    hit.lastUpdateDate.slice(0, 2)
                ).getTime() / 1000
            )
            : null,

        cs_flax_track_id: "",
        track_cs_status: false,

        cyanite_id: hit?.cyanite_id || null,
        cyanite_status: hit?.cyanite_status || "",
        description: null,
        description2: null,

        detail_image_url: hit?.detail_image || "",
        duplicate_track_id: null,
        duration_in_sec: hit?.duration_in_sec || 0,

        edit_ids: [],
        instrument_ids: hit?.amp_instrument_tags?.tag_ids || [],
        is_track_active: hit?.isTrackActive ?? false,
        master_id: hit?.strotswar_master_id || null,

        preview_image_url: getMediaBucketPath(hit?.preview_image, hit?.source_id, 'image') || "",
        preview_track_url: hit?.mp3_track || "",
        publishergemanumber: "",
        registration_title: "",

        stems_zip_mp3_url: hit?.stems_zip || null,
        stems_zip_wav_url: hit?.wav_track || "",

        tag_all: hit?.keywords ? hit.keywords.split(",") : [""],

        tag_amp_allmood_ids:
            hit?.amp_all_mood_tags?.tag_ids?.map((id) => `AAMT-${id}`) || [],
        tag_amp_mainmood: [],
        tag_amp_mainmood_ids: [],
        tag_genre: hit?.amp_genre_tags?.tag_names || [""],
        tag_key: hit?.tag_key ? [hit.tag_key] : [""],
        tag_soniclogo_allmood_ids: null,
        tag_soniclogo_mainmood_ids: null,
        tag_tempo: hit?.tag_tempo || "",
        tempo: hit?.bpm || null,

        trackcsstatus: false,
        track_creator_id: 1,
        track_cyanite_processing_status: hit?.cyanite_status || "",
        track_editor_id: 1,
        trackgemanumber: "",
        track_lyrics: "",
        track_status: hit?.trackStatus ?? false,
        track_name: hit?.track_name || "",
        track_url: hit?.wav_track || "",
        type: hit?.track_cat_type || "master",

        deleted_at: null,
        paid: 10,
        unpaid: 0,

        track_type_id: hit?.track_type_id?.toString() || "",
        TRACKPROVIDER: hit?.provider_track_id || "",
        TRACKPROVIDER: hit?.provider_track_id || "",
        strotswar_track_id: hit?.strotswar_track_id,

        wave_form_js: getMediaBucketPath(`${hit?.wave_form_js}`, hit?.source_id, 'waveform') + `?id=canvas-${hit?.objectID}`,
        strotswar_track_id: hit?.strotswar_track_id,

        amp_genre_ids: hit?.amp_genre_tags?.tag_ids
            ? `[${hit.amp_genre_tags.tag_ids.map((id) => `AGT-${id}`).join(", ")}]`
            : "[]",
    };
}
