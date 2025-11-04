// Example mapping: ID -> Brand
const brandMapping = {
  1: "ADAC",
  2: "AMP",
  3: "MASTERCARD",
  4: "MERCEDES",
  5: "SHELL",
  8: "WPP",
  9: "BCG",
  10: "INTEL",
  12: "COCACOLA",
  13: "VODAFONE",
  14: "GOOGLE",
};

const getBrandLabel = (id) => {
  return brandMapping[id] || id;
};

export default getBrandLabel;
