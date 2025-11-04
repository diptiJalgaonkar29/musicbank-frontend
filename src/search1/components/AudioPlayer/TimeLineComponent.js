import styled from "styled-components";

const TimeLineComponent = styled.div.attrs((props) => ({
  style: {
    width: props.typeTcTP ? "100%" : "600px",
    pointerEvents: props.loadedTrackDataProp ? "none" : "all",
  },
}))`
  display: inline-block;
  position: relative;
  height: 100%;

  background-color: ${(props) =>
    props.img !== null ? "#808080" : "var(--color-card)"};
  visibility: ${(props) => (props.img !== null ? "visible" : "none")};
  opacity: ${(props) => (props.img !== null ? "1" : "0")};
  transition: visibility 0.3s ease-out, opacity 0.3s ease-out,
    background-color 0.3s ease-out;

  box-sizing: border-box;
  image-rendering: -webkit-optimize-contrast;

  &:before {
    content: " ";
    z-index: 20;
    position: absolute;
    background-image: url(${(props) => (props.img ? props.img : null)});
    filter: invert(4%) sepia(68%) saturate(0%) hue-rotate(294deg)
      brightness(20%) contrast(73%);
    -webkit-filter: invert(4%) sepia(68%) saturate(0%) hue-rotate(294deg)
      brightness(20%) contrast(73%);
    -moz-filter: invert(4%) sepia(68%) saturate(0%) hue-rotate(294deg)
      brightness(20%) contrast(73%);
    -o-filter: invert(4%) sepia(68%) saturate(0%) hue-rotate(294deg)
      brightness(20%) contrast(73%);
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
`;

const PseudoParent = styled.div`
  transition: width 0.2s ease-out;
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100%;
  height: 100%;
  background-color: var(--color-primary);
`;

export { TimeLineComponent, PseudoParent };
