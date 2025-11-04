import styled from "styled-components";

const TimeLineComponentV2 = styled.div.attrs((props) => ({
  style: {
    width: props.typeTcTP ? "100%" : "300px",
    pointerEvents: props.loadedTrackDataProp ? "none" : "all",
    height: "40px",
  },
}))`
  display: inline-block;
  position: relative;
  height: 100%;
  background-color: ${(props) =>
    props.img !== null ? "#d9d9d9" : "var(--color-card)"};
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
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    filter: brightness(0%);
  }
`;

const PseudoParentV2 = styled.div`
  transition: width 0.2s ease-out;
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100%;
  height: 100%;
  background-color: ${(props) => {
    return props.showMusicController ? "transparent" : "var(--color-primary)";
  }};
`;

export { TimeLineComponentV2, PseudoParentV2 };
