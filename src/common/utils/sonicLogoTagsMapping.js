import getSonicLogoMainMoodTagLabel from "./getSonicLogoMainMoodTagLabel";

const sonicLogoTagsMapping = (tagArr) => {
  if (!tagArr || !Array.isArray(tagArr) || tagArr?.length === 0) return [];
  let mappedTags = tagArr
    ?.map((tag) => getSonicLogoMainMoodTagLabel(tag))
    .sort();
  return mappedTags;
};
export default sonicLogoTagsMapping;
