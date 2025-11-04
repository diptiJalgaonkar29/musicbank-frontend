import React, { useEffect, useRef, useState } from "react";

// Caches waveform data to avoid re-fetching
const waveformCache = {};
// Caches fetch promises to avoid duplicate requests
const fetchPromises = {};

// 1. Refactored to fix the "no-async-promise-executor" ESLint error
const loadWaveformData = (scriptUrl, fallbackUrl) => {
  if (waveformCache[scriptUrl]) {
    return Promise.resolve(waveformCache[scriptUrl]);
  }
  if (fetchPromises[scriptUrl]) {
    return fetchPromises[scriptUrl];
  }

  const fetchData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();
    const jsonpMatch = text.match(/wfcb\s*\((?:'[^']*'|"[^"]*"),\s*(\[.*\])\s*\)/);
    if (jsonpMatch && jsonpMatch[1]) {
      try {
        return JSON.parse(jsonpMatch[1]);
      } catch (e) { /* Fall through */ }
    }
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.data)) return data.data;
    } catch (e) { /* Fall through */ }
    throw new Error("Invalid or unrecognized waveform data format");
  };

  // **FIX:** Use an async IIFE to avoid the async promise executor anti-pattern
  const promise = (async () => {
    try {
      const data = await fetchData(scriptUrl);
      console.log("CanvasWaveform Loaded waveform data from primary URL:", data);
      waveformCache[scriptUrl] = data;
      return data;
    } catch (primaryError) {
      console.error(`Failed to load primary URL (${scriptUrl}):`, primaryError);
      if (fallbackUrl) {
        console.log("Attempting to use fallback URL:", fallbackUrl);
        try {
          const data = await fetchData(fallbackUrl);
          waveformCache[scriptUrl] = data; // Cache result under original key
          return data;
        } catch (fallbackError) {
          console.error(`Failed to load fallback URL (${fallbackUrl}):`, fallbackError);
          // Throwing an error inside an async function will reject the promise
          throw new Error("Failed to load waveform from both primary and fallback URLs.");
        }
      } else {
        throw new Error("Failed to load waveform and no fallback was provided.");
      }
    }
  })();

  fetchPromises[scriptUrl] = promise;
  return promise;
};

const CanvasWaveform = ({ scriptUrl, fallbackUrl }) => {
    console.log("CanvasWaveform mounted", scriptUrl, fallbackUrl);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Drawing logic (no changes needed)
  const drawWaveform = (canvas, heights) => {
    // ...existing code...
    if (!canvas || !heights || heights.length === 0) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / heights.length;
    const maxVal = heights.reduce((max, h) => Math.max(max, Math.abs(h)), 0);
    ctx.fillStyle = "#2196f3";
    heights.forEach((h, i) => {
      const barHeight = maxVal > 0 ? (Math.abs(h) / maxVal) * height : 0;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    });
  };

  // 3. useEffect (no changes needed)
  useEffect(() => {
    console.log("CanvasWaveform useeffect", scriptUrl, fallbackUrl);
    let isMounted = true;
    if (!scriptUrl || scriptUrl === null) {
      setError("No waveform URL provided.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    loadWaveformData(scriptUrl, fallbackUrl)
      .then((data) => {
        console.log("CanvasWaveform - Loaded waveform data:", data);
        if (!isMounted) return;
        const heights = Array.isArray(data) ? data : data?.data || [];
        if (canvasRef.current) {
          drawWaveform(canvasRef.current, heights);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.toString());
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [scriptUrl, fallbackUrl]);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {loading && <p>Loading preview...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <canvas
        ref={canvasRef}
        width={600}
        height={100}
        style={{
          display: loading || error ? "none" : "block",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default CanvasWaveform;