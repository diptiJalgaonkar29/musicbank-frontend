import React, { Component, useEffect } from "react";
import { ReactSVG } from "react-svg";
import Tickmark from "../../static/supersearch/gsearch-check-mark.svg";

var bubbleSizeProp = 3;
var bubbleRatio = 0.3;

export const SSBubble = (props) => {
  const bubbleRadii = props.itemData.bubblescale;
  const resultCount = props.itemData.count;
  const bubbleName = props.itemData.label;
  const bubbleX = props.itemData.bubbleX;
  const bubbleY = props.itemData.bubbleY;

  const bubbleRadiiM = bubbleRadii - bubbleRadii * bubbleRatio;
  //const bubbleSizeM = props.itemData.count * bubbleSizeProp
  const bubbleSizeM = props.itemData.bubblescale;

  useEffect(() => {
    // draw(`btag_${bubbleName}`);
    setTimeout(() => {
      //props.updateMasonary();
    }, 1000);
  });

  const draw = (_id) => {
    var canvas = document.getElementById(_id);
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");
      var X = canvas.width / 2;
      var Y = canvas.height / 2;
      var R = bubbleRadiiM;
      ctx.beginPath();
      ctx.arc(X, Y, bubbleRadiiM, 0, 2 * Math.PI, false);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#FF0000";
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = "blue";
      ctx.arc(X, Y, bubbleRadiiM, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx = canvas.getContext("2d");
      ctx.font = "2rem";
      ctx.fillStyle = "var(--color-white)";
      ctx.textAlign = "center";
      ctx.fillText(`${bubbleName}(${resultCount})`, X, Y + 4);
    }
  };

  return (
    <>
      {/* <div className="item circle" style={`width: ${props.count}px; height: ${props.count}px;`}></div> */}
      {/* <div className="item ssbubble" style={{ width: bubbleSizeM, height: bubbleSizeM }} >
                <div className="text"><p>{props.itemData.label}<br/>({props.itemData.count})</p></div>            
            </div>  */}
      {/* <canvas className="ssbubble1" id={`btag_${bubbleName}`} width="150" height="150"></canvas>  */}

      {/* <div className="res-circle ssbubble" style={{ width: bubbleSizeM, height: bubbleSizeM }}>
                <div className="circle-txt text"><p>{bubbleName}({resultCount})</p></div>
            </div> */}

      <div
        className="bubbleBox"
        style={{
          width: `${bubbleSizeM}px`,
          height: `${bubbleSizeM}px`,
          X: `${bubbleX}px`,
          Y: `${bubbleY}px`,
        }}
      >
        {props.itemData.isRefined && (
          <ReactSVG
            svgstyle={{ transform: "scale(1)" }}
            className="bubblecheckmark"
            src={`${Tickmark}`}
            style={{ float: "left" }}
          />
        )}
        <p>
          {bubbleName}
          <br />({resultCount})
        </p>
      </div>
    </>
  );
};
