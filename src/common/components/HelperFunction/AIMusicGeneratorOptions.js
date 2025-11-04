import { FormattedMessage } from "react-intl";
import VideoUploadView from '../../../AISearch/VideoUploadView/VideoUploadView';
import BriefSearchView from '../../../AISearch/BriefSearchView/BriefSearchView';
import SimilaritySearchView from '../../../AISearch/SimilaritySearchView/SimilaritySearchView';

const AIMusicGeneratorOptions = [
  {
    key: "video",
    icon: "Video",
    title: (
      <FormattedMessage
        id={"AISearch.GenerateMusicWithVideoTitle"}
      />
    ),
    subTitle: (
      <FormattedMessage
        id={"AISearch.GenerateMusicWithVideoSubtitle"}
      />
    ),
    Component: VideoUploadView,
  },
  {
    key: "brief",
    icon: "MusicFile",
    title: (
      <FormattedMessage
        id={"AISearch.GenerateMusicWithBriefTitle"}
      />
    ),
    subTitle: (
      <FormattedMessage
        id={"AISearch.GenerateMusicWithBriefSubtitle"}
      />
    ),
    Component: BriefSearchView,
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

export default AIMusicGeneratorOptions;
