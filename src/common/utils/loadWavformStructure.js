export const loadWavformStructure = (url) => {
  return new Promise((resolve, reject) => {
    // Define global callback before script loads
    window.wfcb = (id, data) => {
      resolve({ id, data });
    };

    const script = document.createElement("script");
    script.src = url;
    script.async = true;

    script.onload = () => {
      // if the remote script never called wfcb, reject
      setTimeout(() => {
        reject(new Error("wfcb was not called by remote file"));
      }, 5000);
    };

    script.onerror = () => reject(new Error("Failed to load waveform script"));
    document.body.appendChild(script);
  });
};