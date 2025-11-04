import React, { useEffect } from "react";
import "./AIMusicSearchPage.css";
import { FormattedMessage } from "react-intl";
import AIMusicGeneratorOptions from "../../common/components/HelperFunction/AIMusicGeneratorOptions";
import MainLayout from "../../common/components/MainLayout/MainLayout";
import IconWrapper from "../../branding/componentWrapper/IconWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import VideoUpload from "../VideoUploadView/VideoUpload/VideoUpload";
import { useSelector } from "react-redux";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import { localStorageCommonAISearch } from "../Services/localStorageCommonAISearch";

const AIMusicSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search);
  const selectedOption = queryParams.get("option") || "all"; // Default to "video" if no option is selected
  const { aiMusicGenerator } = useSelector((state) => state.aiMusicGenerator);

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("AISearchConfig"))?.aiSearchId;
    if (id) {
      navigate(
        `/ai_search/workspace?option=${
          JSON.parse(localStorage.getItem("AISearchConfig"))?.aiSearchOption
        }&aiSearchid=${id}`
      );
    }
  }, []);

  const handleOptionClick = (key) => {
    console.log("key", key);
    localStorageCommonAISearch("AISearchConfig", {
      aiSearchOption: key,
    });
    queryParams.set("option", key);
    navigate({ search: queryParams.toString() });
  };

  const selectedConfig = AIMusicGeneratorOptions.find(
    (option) => option.key === selectedOption
  );

  const RightPanelComponent = selectedConfig?.Component;

  return (
    <MainLayout>
      <div className="AIMusicGenerator_container">
        <div className="content">
          {/* selection cards */}
          <div className="cards-grid">
            {AIMusicGeneratorOptions?.map(({ key, icon, title, subTitle }) => (
              <div
                // id={key}
                className={`card ${
                  aiMusicGenerator?.isLoading ? "loading" : ""
                } ${
                  selectedOption === key || selectedOption === "all"
                    ? "active"
                    : "not-active"
                }`}
                key={key}
                onClick={() => handleOptionClick(key)}
              >
                <div className="card-icon">
                  <IconWrapper icon={icon} />
                </div>
                <h2>{title}</h2>
                <p>{subTitle}</p>
                {/* ✅ Conditionally render the upload button for "video" option */}
                {selectedOption === "video" && key === "video" && (
                  <VideoUpload />
                )}
              </div>
            ))}
            <div className="bottomBar">
              <p className="cmn_label">Not convinced with the track results?</p>
              <ButtonWrapper
                className="commision_button"
                onClick={() => navigate("/CustomTrackForm")}
              >
                Commission a Custom Track
              </ButtonWrapper>
            </div>
          </div>

          <>
            {RightPanelComponent ? (
              <div className="AISearch_Content">
                <RightPanelComponent />
              </div>
            ) : (
              <div className="AISearch_Content">
                <div className="Intro-text">
                  <h1>
                    <FormattedMessage id={"AISearch.title"} />
                  </h1>
                  <p className="subtitle">
                    <FormattedMessage id={"AISearch.subtitle"} />
                  </p>
                  <p className="option_selection_title">
                    <FormattedMessage id={"AISearch.optionSelectionTitle"} />
                  </p>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIMusicSearchPage;
