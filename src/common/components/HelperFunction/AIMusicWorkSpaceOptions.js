import { FormattedMessage } from "react-intl";
import SimilaritySearchView from '../../../AISearch/SimilaritySearchView/SimilaritySearchView';
import TrackResultView from '../../../AISearch/TrackResultView/TrackResultView';

const AIMusicWorkSpaceOptions = [
  {
    key: "video",
    icon: "Video",
    title: (
      <FormattedMessage
        id={"AISearch.GenerateMusicWithVideoTitle"}
      />
    ),
    Component: TrackResultView,
  },
  {
    key: "brief",
    icon: "MusicFile",
    title: (
      <FormattedMessage
        id={"AISearch.GenerateMusicWithBriefTitle"}
      />
    ),
    Component: TrackResultView,
  },
  {
    key: "SimilaritySearch",
    icon: "AIMusic",
    title: (
      <FormattedMessage
        id={"AISearch.GenerateSimilaritySearchTitle"}
      />
    ),
    subTitle: (
      <FormattedMessage
        id={"AISearch.GenerateSimilaritySearchSubtitle"}
      />
    ),
    Component: SimilaritySearchView,
  },
];

export default AIMusicWorkSpaceOptions;
