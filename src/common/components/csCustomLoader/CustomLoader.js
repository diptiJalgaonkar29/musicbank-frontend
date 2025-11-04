import React, { useEffect, useState } from 'react'
import CustomLoaderSpinner from '../customLoaderSpinner/CustomLoaderSpinner';
import "./CustomLoader.css";
import { FormattedMessage } from 'react-intl';

export default function CustomLoader({ stopPolling }) {
    const [loadingText, setLoadingText] = useState("");

    function randomIntFromInterval(min, max) {
        if (isNaN(min) || isNaN(max)) return;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const setRandomLoadingSentence = (Messages = ["Loading..."]) => {
        let randomInt = randomIntFromInterval(0, Messages.length - 1);
        let loadingSentence = Messages[randomInt] || "";
        setLoadingText(loadingSentence);
    };

    useEffect(() => {
        setRandomLoadingSentence(window.globalConfig?.LOADER_MESSAGES);

        const intervalId = setInterval(() => {
            setRandomLoadingSentence(window.globalConfig?.LOADER_MESSAGES);
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="overlayBg loader_container">
            <div className="overlay">
                <div className="left">
                    <CustomLoaderSpinner />
                </div>
                <div className="right">
                    {loadingText ? (
                        <p>{loadingText}</p>
                    ) : (
                        <div className="loader_text_skeleton">
                            <p></p>
                            <p></p>
                        </div>
                    )}
                    <span
                        className="cancel_btn"
                        onClick={() => {
                            stopPolling()
                            // window.location.reload();
                        }}
                    >
                        Cancel
                    </span>
                </div>
            </div>
        </div>
    )
}
