import { useState, useEffect, useRef } from "react";
import "./TrendingAudio.css";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import getAlgoliaMoodAndGenreCount from "./getAlgoliaMoodAndGenreCount";
import Top10Genre from "./Top10Genre";
import Top10Moods from "./Top10Moods";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";

const ChartLayout = ({ label, children, id }) => {
  let customClassName = label?.replace(/\s+/g, "-")?.toLowerCase();
  return (
    <div className={`chart_layout_container ${customClassName}`} id={id}>
      {/* <p className="label">{label}</p> */}
      {children}
    </div>
  );
};

const TrendingAudio = () => {
  const pdfPage1componentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [genreAndMoodStats, setGenreAndMoodStats] = useState({
    tag_amp_mainmood_ids: {},
    tag_genre: {},
    isLoading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const Data = await getAlgoliaMoodAndGenreCount();
        setGenreAndMoodStats(Data);
      } catch (error) {
        console.error("Error fetching mood and genre count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
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
                  fontWeight: 400,
                  fontStyle: "Regular",
                  fontSize: "20px",
                  leadingTrim: "NONE",
                  lineHeight: "120%",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                  marginBottom: "20px",
                }}
              >
                Trending Audio
              </span>
            </div>
            <Grid container alignItems="center" spacing={4}>
              <Grid item xs={12} sm={6}>
                <ChartLayout label={"Top 10 Moods"}>
                  <Top10Moods
                    data={genreAndMoodStats?.tag_amp_mainmood_ids || {}}
                    isLoading={genreAndMoodStats?.isLoading}
                  />
                </ChartLayout>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ChartLayout label={"Top 10 Genres"}>
                  <Top10Genre
                    data={genreAndMoodStats?.tag_genre || {}}
                    isLoading={genreAndMoodStats?.isLoading}
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
