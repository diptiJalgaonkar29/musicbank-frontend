import "./HomePageV3.css";
import MainLayout from "../../../common/components/MainLayout/MainLayout";
import HomePageV3Header from "../../components/HomePageV3Header/HomePageV3Header";
import CuratedPlaylistSlider from "../../components/CuratedPlaylistSlideShow/CuratedPlaylistSlideShow";
import RecentlyAddedTracksListV3 from "../../components/RecentlyAddedTracksList/RecentlyAddedTracksListV3";
import ActiveProjects from "../../components/ActiveProjects/ActiveProjects";
import TrendingAudio from "../../components/TrendingAudio/TrendingAudio";
import { Grid } from "@mui/material";

const HomePageV3 = () => {
  return (
    <MainLayout>
      <HomePageV3Header />
      <div className="HomePageGrids">
        <main className="homePageV3_content">
          <div className="homePageV3_content_left">
            <Grid item xs={6} sx={{ m: "15px" }}>
              <CuratedPlaylistSlider />
            </Grid>
            <Grid item xs={6} sx={{ m: "15px" }}>
              <ActiveProjects />
            </Grid>
          </div>
          <div className="homePageV3_content_right">
            <Grid item xs={6} sx={{ m: "15px" }}>
              <TrendingAudio />
            </Grid>
            <Grid item xs={6} sx={{ m: "15px" }}>
              <RecentlyAddedTracksListV3 />
            </Grid>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};
export default HomePageV3;
