import { useState, useEffect, useRef, useContext } from "react";
import "./TrendingAudio.css";
import { Grid } from "@mui/material";
import getAlgoliaMoodAndGenreCount from "./getAlgoliaMoodAndGenreCount";
import Top10Genre from "./Top10Genre";
import Top10Moods from "./Top10Moods";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

const ChartLayout = ({ label, children, id }) => {
  let customClassName = label?.replace(/\s+/g, "-")?.toLowerCase();
  return (
    <div className={`chart_layout_container ${customClassName}`} id={id}>
      {children}
    </div>
  );
};

const TrendingAudio = () => {
  const pdfPage1componentRef = useRef();
  const [genreAndMoodStats, setGenreAndMoodStats] = useState({
    tag_amp_mainmood_ids: {},
    tag_genre: {},
    isLoading: true,
  });

  const { config } = useContext(BrandingContext);

  useEffect(() => {
    if (!config) return; // wait until branding config loaded

    const fetchData = async () => {
      setGenreAndMoodStats((prev) => ({ ...prev, isLoading: true }));

      try {
        const data = await getAlgoliaMoodAndGenreCount(config);
        setGenreAndMoodStats(data);
      } catch (error) {
        console.error("Error fetching mood/genre counts:", error);
      }
    };

    fetchData();
  }, [config]); // IMPORTANT FIX

  return (
    <>
      {genreAndMoodStats.isLoading ? (
        <div className="project_loader">
          <SpinnerDefault />
        </div>
      ) : (
        <main
          className="trending_audio_main"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div className="statistics_main" ref={pdfPage1componentRef}>
            <div style={{ marginBottom: "20px" }}>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 400,
                }}
              >
                Trending Audio
              </span>
            </div>

            <Grid container alignItems="center" spacing={4}>
              <Grid item xs={12} sm={6}>
                <ChartLayout label={"Top 10 Moods"}>
                  <Top10Moods
                    data={genreAndMoodStats.tag_amp_mainmood_ids}
                    isLoading={genreAndMoodStats.isLoading}
                  />
                </ChartLayout>
              </Grid>

              <Grid item xs={12} sm={6}>
                <ChartLayout label={"Top 10 Genres"}>
                  <Top10Genre
                    data={genreAndMoodStats.tag_genre}
                    isLoading={genreAndMoodStats.isLoading}
                  />
                </ChartLayout>
              </Grid>
            </Grid>
          </div>
        </main>
      )}
    </>
  );
};

export default TrendingAudio;
