import { useMemo, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import axios from "axios";
import AsyncService from "../../networking/services/AsyncService";

const useDebouncedSocialMediaAPI = (delay = 2000) => {
  const debouncedApiCall = useMemo(() => {
    return debounce(
      async (trackId, algoliaId, socialMedia, ID, type, newDataByProjectId) => {
        let data = {
          trackId,
          algoliaId,
          socialMedia: socialMedia?.map((e) => e?.value),
          ID,
          type,
        };

        try {
          await AsyncService?.putData(
            "projectTracks/updateSocialMediaId",
            data
          );
          newDataByProjectId(ID);
        } catch (err) {
          console.error("API error:", err);
        }
      },
      delay
    );
  }, [delay]);

  useEffect(() => {
    return () => {
      debouncedApiCall.cancel();
    };
  }, [debouncedApiCall]);

  return debouncedApiCall;
};

export default useDebouncedSocialMediaAPI;
