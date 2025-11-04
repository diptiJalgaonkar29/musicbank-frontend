import React, { useEffect, useRef, useState } from "react";
import "./WaveSurfaceImage.css";
import { brandConstants } from "../../../common/utils/brandConstants";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
// Helper: draw waveform image from peaks
const drawWaveformImage = (peaks, width, height = 60) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Fill background black
  ctx.fillStyle = getSuperBrandName() === brandConstants.WPP ? "#F8F9FB" : "#000";
  ctx.fillRect(0, 0, width, height);

  // Make waveform transparent
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#ffffff";

  const step = peaks.length / width;
  for (let i = 0; i < width; i++) {
    const peak = Math.abs(peaks[Math.floor(i * step)]); // Normalize peaks
    const y = peak * height;
    ctx.fillRect(i, (height - y) / 2, 1, y);
  }

  ctx.globalCompositeOperation = "source-over";
  return canvas.toDataURL();
};

// Load waveform peaks from script
const loadWaveformData = (scriptUrl, fallbackUrl) => {
  return new Promise((resolve, reject) => {
    window.wfcb = (id, data) => {
      resolve(data);
    };

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onerror = () => {
      if (fallbackUrl) {
        const fallbackScript = document.createElement("script");
        fallbackScript.src = fallbackUrl;
        fallbackScript.async = true;
        fallbackScript.onerror = () =>
          reject("Failed to load waveform scripts");
        document.body.appendChild(fallbackScript);
      } else reject("Failed to load waveform script");
    };
    document.body.appendChild(script);
  });
};

const WaveSurferImage = ({
  waveformScriptUrl,
  fallbackScriptUrl,
  longWidth = false,
  flag,
}) => {
  const [waveImg, setWaveImg] = useState(null);
  const containerRef = useRef(null);
  const superBrandName = getSuperBrandName();

  useEffect(() => {
    let isCancelled = false;

    const fetchAndDraw = async () => {
      try {
        const peaks = await loadWaveformData(
          waveformScriptUrl,
          fallbackScriptUrl
        );
        if (isCancelled) return;

        // Get container width dynamically
        let containerWidth = containerRef.current?.offsetWidth || 500;

        // Apply calc(100% - 20px) logic only when longWidth = true
        if (longWidth) {
          containerWidth = containerWidth - 20;
        }

        const imgUrl = await drawWaveformImage(peaks, containerWidth, 60);
        setWaveImg(imgUrl);
      } catch (err) {
        console.error("Failed to generate waveform image", err);
      }
    };

    fetchAndDraw();

    return () => {
      isCancelled = true;
      setWaveImg(null);
      if (window.__wfcbQueue) window.__wfcbQueue = [];
      if (window.wfcb) window.wfcb = () => {};
    };
  }, [waveformScriptUrl, fallbackScriptUrl, longWidth]);

  return (
    <div
      ref={containerRef}
      className="waveImage wavesurferimage"
      style={{
        width: "100%",
        // backgroundColor: "#fff",
        height: "60px",
      }}
    >
      {waveImg ? (
        <img
          src={waveImg}
          alt="waveform"
          style={{
            width: "100%",
            height: "60px",
          }}
        />
      ) : (
        <div className="waveImageloading">Loading waveformImage...</div>
      )}
    </div>
  );
};

export default WaveSurferImage;
