import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./WaveSurfaceImage.css";
import { brandConstants } from "../../../common/utils/brandConstants";
import getSuperBrandName from "./../../../common/utils/getSuperBrandName";

const waveformCache = {};
const scriptPromises = {};

// Function to load waveform data
const loadWaveformData = (scriptUrl, fallbackUrl) => {
  if (waveformCache[scriptUrl]) {
    return Promise.resolve(waveformCache[scriptUrl]);
  }
  if (scriptPromises[scriptUrl]) {
    return scriptPromises[scriptUrl];
  }

  scriptPromises[scriptUrl] = new Promise((resolve, reject) => {
    // Init queue once
    if (!window.__wfcbQueue) {
      window.__wfcbQueue = [];
    }

    // Always rebind wfcb so every new script can trigger it
    window.wfcb = (id, data) => {
      const next = window.__wfcbQueue.shift();
      if (next) next(data);
    };

    // Push resolver to queue
    window.__wfcbQueue.push((data) => {
      waveformCache[scriptUrl] = data;
      resolve(data);
    });

    // Load the script
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;

    script.onerror = () => {
      console.error("Failed to load waveform script:", scriptUrl);
      if (fallbackUrl) {
        const fallbackScript = document.createElement("script");
        fallbackScript.src = fallbackUrl;
        fallbackScript.async = true;
        fallbackScript.onerror = () =>
          reject("Failed to load both primary and fallback waveform scripts");
        document.body.appendChild(fallbackScript);
      } else {
        reject("No fallback script provided");
      }
    };

    document.body.appendChild(script);
  });

  return scriptPromises[scriptUrl];
};

const resolveColor = (colorVar) => {
  if (!colorVar) return colorVar;

  // Handle var(--color-name)
  if (colorVar.startsWith("var(")) {
    const name = colorVar.slice(4, -1).trim();
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        ?.trim() || colorVar
    );
  }

  // Handle --color-name
  if (colorVar.startsWith("--")) {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(colorVar)
        ?.trim() || colorVar
    );
  }

  // Already hex/rgb
  console.log("resolve",colorVar)
  return colorVar;
};

const WaveSurferForm = ({
  waveformScriptUrl,
  fallbackScriptUrl,
  duration,
  wavformjsurl,
}) => {
  // console.log(
  //   "WaveSurferForm - wavformjsurl",
  //   waveformScriptUrl,
  //   wavformjsurl,
  //   fallbackScriptUrl
  // );

  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [ready, setReady] = useState(false);
  const superBrandName = getSuperBrandName();
  useEffect(() => {
    let isCancelled = false;

    const setupWaveform = async () => {
      if (!containerRef.current || !duration) return;

      try {
        // Load waveform peaks
        const peaks = await loadWaveformData(
          waveformScriptUrl || fallbackScriptUrl,
          fallbackScriptUrl
        );
        if (isCancelled || !containerRef.current) return;

        const peaksCopy = JSON.parse(JSON.stringify(peaks));

        // Destroy old instance if exists
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }

        // Create new WaveSurfer instance
        wavesurferRef.current = WaveSurfer.create({
          container: containerRef.current,
          waveColor: superBrandName === brandConstants.WPP ? "#000" : "#fff",
          //waveColor: resolveColor("--color-bg-dark"),
          progressColor: "purple",
          cursorColor: "transparent",
          barWidth: 2,
          barGap: 2,
          height: 60,
          responsive: true,
          hideScrollbar: true,
          backend: "MediaElement",
        });

        // Load with empty audio (using only peaks)
        wavesurferRef.current.load(
          "data:audio/mp3;base64,",
          peaksCopy,
          duration
        );

        setReady(true);
      } catch (err) {
        console.error("Waveform setup failed:", err);
      }
    };

    setupWaveform();

    return () => {
      isCancelled = true;
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [waveformScriptUrl, fallbackScriptUrl, duration]);

  return (
    <div style={{ width: "100%" }} ref={containerRef} className="waveformJs">
      {!ready && <p>Loading waveform...</p>}
    </div>
  );
};

export default WaveSurferForm;
