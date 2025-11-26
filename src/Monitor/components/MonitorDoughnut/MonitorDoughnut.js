import React , {useState ,useEffect} from 'react'
import { Grid } from "@mui/material";
import Top10Genre from "../../../search1/components/TrendingAudio/Top10Genre";
import Top10Moods from "../../../search1/components/TrendingAudio/Top10Moods";
import './MonitorDoughnut.css';
import getAlgoliaMoodAndGenreCount from '../../../search1/components/TrendingAudio/getAlgoliaMoodAndGenreCount';

export default function MonitorDoughnut() {
    const ChartLayout = ({ label, children, id }) => {
  let customClassName = label?.replace(/\s+/g, "-")?.toLowerCase();
  return (
    <div className={`chart_layout_container ${customClassName}`} id={id}>
      {/* <p className="label">{label}</p> */}
      {children}
    </div>
  );
};

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
    <div>
      <Grid container alignItems="center" justifyContent='space-around' spacing={4}>
           <div className='piechart-Div'>
              <Grid item xs={12} sm={6} className="top-10-moods-grid">
                <ChartLayout label={"Top 10 Moods"}>
                  <Top10Moods
                    data={genreAndMoodStats?.tag_amp_mainmood_ids || {}}
                    isLoading={genreAndMoodStats?.isLoading}
                  />
                </ChartLayout>
              </Grid>
              </div>
               <div className='piechart-Div'>
              <Grid item xs={12} sm={6} className="top-10-genre-grid">
                <ChartLayout label={"Top 10 Genres"}>
                  <Top10Genre
                    data={genreAndMoodStats?.tag_genre || {}}
                    isLoading={genreAndMoodStats?.isLoading}
                  />
                </ChartLayout>
              </Grid>
              </div>
    </Grid>
    </div>
  )
}
