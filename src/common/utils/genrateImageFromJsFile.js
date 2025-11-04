const drawWaveformImage = (peaks, width, height = 60) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Fill background black
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    // Make waveform transparent
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "#ffffff";

    const step = peaks.length / width;
    for (let i = 0; i < width; i++) {
        const peak = Math.abs(peaks[Math.floor(i * step)]);
        const y = peak * height;
        ctx.fillRect(i, (height - y) / 2, 1, y);
    }

    ctx.globalCompositeOperation = "source-over";
    return canvas.toDataURL("image/png"); // base64 image URL
};

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

export const generateWaveformImage = async ({
    waveformScriptUrl,
    fallbackScriptUrl,
    width = 500,
    height = 60,
    longWidth = false,
}) => {

    try {
        const peaks = await loadWaveformData(waveformScriptUrl, fallbackScriptUrl);

        let finalWidth = width;
        if (longWidth) finalWidth -= 20;

        return drawWaveformImage(peaks, finalWidth, height);
    } catch (err) {
        console.error("Failed to generate waveform image", err);
        return null;
    } finally {
        if (window.__wfcbQueue) window.__wfcbQueue = [];
        if (window.wfcb) window.wfcb = () => { };
    }
};
