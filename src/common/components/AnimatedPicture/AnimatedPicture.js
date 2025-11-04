import React, { Component } from "react";
import { SpinnerDefault } from "../Spinner/Spinner";

import "../../../_styles/AnimatedPicture.css";

function reveal(index) {
  const element = document.getElementById(`picture-${index}`);
  const inner = document.getElementById(`inner-picture-${index}`);

  const outScale = 0.85;
  const easing = 0.25;
  const inScale = 1;
  let targetScale = outScale;
  let elementScale = targetScale;
  let innerScale = 1 / elementScale;

  element.addEventListener("pointerover", () => {
    targetScale = inScale;
  });

  element.addEventListener("pointerout", () => {
    targetScale = outScale;
  });

  const update = () => {
    elementScale += (targetScale - elementScale) * easing;
    innerScale = 1 / elementScale;

    element.style.transform = `scale(${elementScale})`;
    inner.style.transform = `scale(${innerScale})`;

    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

export default class Picture extends Component {
  componentDidMount() {
    reveal(this.props.index);
  }

  render() {
    let content = <SpinnerDefault />;
    if (!this.props.loading && this.props.srcUrl !== null) {
      content = <img src={this.props.srcUrl} alt="Preview" />;
    }

    return (
      <div
        className={"circular-reveal"}
        id={`picture-${this.props.index}`}
        onClick={this.props.clickedOnImage}
      >
        <div
          className={"circular-reveal__content"}
          id={`inner-picture-${this.props.index}`}
        >
          {content}
        </div>
      </div>
    );
  }
}
