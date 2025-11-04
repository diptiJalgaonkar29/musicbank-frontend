import React, { createRef, useEffect, useRef } from "react";

//import useScreenSize from "use-screen-size";
import { SSBubble } from "./SSBubble10-rnd";
//import { Square } from "./Square";
//import BubbleTagCloud from "./BubbleTagCloud10"; d3v3

import BubbleTagCloud from "./BubbleTagCloud5"; //d3v7
//import BubbleTagCloud from "./BubbleTagCloud5Test1"; //d3v3
import { Scrollbar } from "react-scrollbars-custom";

import differenceBy from "lodash/differenceBy";
import getAmpMainMoodTagLabel from "../../common/utils/getAmpMainMoodTagLabel";
import getSonicLogoMainMoodTagLabel from "../../common/utils/getSonicLogoMainMoodTagLabel";
import trackExternalAPICalls from "../../common/services/trackExternalAPICalls";
import { connectRefinementList } from "react-instantsearch-dom";

var canvasId = "canv";
var context;
var timeStamp, oldTimeStamp, secondsPassed;
var gameObjects = [];
var canvas;

var circle;
var circles;
var xMax, yMax;
var stageW, stageH;
var tagName = "";
var clearedOnce = false;

const RefinementList = ({
  items,
  refine,
  createURL,
  ssFilterTag,
  ssBaseRef,
  searchForItems,
  allTags,
  attribute,
  clearedOnce,
}) => {
  //const size = useScreenSize();

  tagName = ssFilterTag.replace("tag_", "");

  // console.log("allTags ", allTags);
  var tagSetArrN = [];
  if (allTags !== undefined) {
    for (var key in allTags) {
      if (allTags.hasOwnProperty(key)) {
        tagSetArrN.push({
          label: key,
          count: allTags[key],
          isRefined: false,
          isActive: false,
        });
      }
    }
    // console.log("tagSetArr", tagSetArrN);
  }

  var ssFilterItems = items;
  // console.log("ssFilterItems ", ssFilterItems);

  //ssFilterItems = items.slice(0, 20).map((items, i) => { return items; });
  //ssFilterItems = ssFilterItems.sort(() => Math.random() - 0.5);

  if (ssFilterItems.length > 0) {
    //normaliseObject(ssFilterItems, range, size);
    //console.log("normalize ", ssFilterItems);
    //generateTagSet(tagSetArrN, ssFilterItems, range, size);

    try {
      stageW =
        document.getElementsByClassName("gsearchBubbleDiv")[0].clientWidth;
    } catch (error) {
      stageW = visualViewport.width;
    }
    stageH = visualViewport.height;

    Object.keys(ssFilterItems).forEach((el) => {
      ssFilterItems[el].isActive = true;
    });

    const myDifferences = differenceBy(tagSetArrN, ssFilterItems, "label");
    // console.log("ss----tagname --", tagName);
    // console.log("ss----tagarr --", tagSetArrN);
    // console.log("ss----obj --", ssFilterItems);
    // console.log("ss----diffe --", myDifferences);

    //tagSetArrN = [...ssFilterItems, ...myDifferences.slice(0,10)]
    tagSetArrN = [...ssFilterItems, ...myDifferences];
    // console.log("ss----tagSetArrN --", tagSetArrN);
  }

  const ref = useRef();

  useEffect(() => {
    clearAllTagsOnce();
  });

  const clearAllTagsOnce = () => {
    // console.log("clearAllTagsOnce - sscustomrefinebubbles ");
    try {
      if (document.getElementsByClassName("gsTagClearAll").length > 0) {
        if (items.length > 0 && clearedOnce == false) {
          document.getElementsByClassName("gsTagClearAll")[0].click();
          clearedOnce = true;
        } else clearedOnce = false;
      } else {
        clearedOnce = false;
      }
    } catch (error) {}
  };

  // console.log("allTagsData", tagSetArrN);
  // console.log("allTagsData data", ssFilterItems);

  const getDisplayLabel = (label) => {
    switch (attribute) {
      case "tag_amp_mainmood_ids":
        return getAmpMainMoodTagLabel(label);
      case "tag_soniclogo_mainmood_ids":
        return getSonicLogoMainMoodTagLabel(label);
      default:
        return label;
    }
  };

  return (
    <div className="ssBubbleHolder " id={`ssBubbleHolder_${ssFilterTag}`}>
      <Scrollbar
        trackXVisible
        className="bubbleScroll"
        style={{ width: stageW, height: 500 }}
      >
        <BubbleTagCloud
          allTagsData={tagSetArrN?.map((data) => ({
            ...data,
            displayLabel: getDisplayLabel(data?.label),
          }))}
          data={ssFilterItems?.map((data) => ({
            ...data,
            displayLabel: getDisplayLabel(data?.label),
          }))}
          height={500}
          width={stageW}
          tagName={tagName}
          onBubbleClick={(dataItem) => {
            // console.log("clear all mouse ", dataItem.isRefined, dataItem.label);
            clearedOnce = true;
            document
              .getElementById(`ssBubbleItem_${dataItem.label}`)
              .getElementsByTagName("a")[0]
              .click();
            trackExternalAPICalls({
              url: "",
              requestData: JSON.stringify({
                refinedLabel: dataItem.label,
              }),
              usedFor: "SuperSearch",
              serviceBy: "Algolia",
              statusCode: 200,
              statusMessage: "",
            });
          }}
        />
      </Scrollbar>
      <div className="refineSet" style={{ display: `none` }}>
        {ssFilterItems.map((item, i) => {
          return (
            <div
              key={item.label}
              id={`ssBubbleItem_${item.label}`}
              className={`bubbleItem1`}
            >
              <a
                href={createURL(item.value)}
                style={{ fontWeight: item.isRefined ? "bold" : "" }}
                onClick={(event) => {
                  event.preventDefault();
                  refine(item.value);
                }}
              >
                {item.label}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SSCustomRefinementBubbles = connectRefinementList(RefinementList);

const range = [30, 100];

const generateTagSet = (tagArr, obj, range, size) => {
  try {
    stageW = document.getElementsByClassName("gsearchBubbleDiv")[0].clientWidth;
  } catch (error) {
    stageW = visualViewport.width;
  }

  stageH = visualViewport.height;
  var newTagSet = [];

  for (var i = 0; i < tagArr.length; i++) {
    //console.log("tagArr-- "+i+tagArr[i].label+tagArr[i].count,obj);
    //tagArr.push({"label": tagArr.label})
  }

  const myDifferences = differenceBy(tagArr, obj, "label");
  // console.log("ss----tagname --", tagName);
  // console.log("ss----tagarr --", tagArr);
  // console.log("ss----obj --", obj);
  // console.log("ss----diffe --", myDifferences);

  newTagSet = [...obj, myDifferences];
};

///////////////

const normaliseObject = (obj, range, size) => {
  stageW = document.getElementsByClassName("gsearchBubbleDiv")[0].clientWidth;
  stageH = visualViewport.height;
  //console.log("normalize ", stageW, stageH);

  //const values = Object.values(obj.count);
  var valCountArr = obj.flatMap((x) => x.count);
  const min = Math.min.apply(Math, valCountArr);
  const max = Math.max.apply(Math, valCountArr);
  let diff = max - min;
  diff = diff <= 0 ? 1 : diff;

  const variation = (range[1] - range[0]) / diff;
  Object.keys(obj).forEach((el) => {
    // console.log("normaliseObject ", el, obj[el]);
    const val = (
      range[0] +
      (parseFloat(obj[el].count) - min) * variation
    ).toFixed(2);
    //obj[el] = +val;
    //obj[el].bubblescale = parseFloat(obj[el].count) + parseFloat(val);
    //obj[el].rad = parseFloat(obj[el].count) + parseFloat(val);
    //obj[el].rad = parseFloat(obj[el].count);
    //obj[el].bubbleX = Math.random() * (stageW - obj[el].bubblescale * 2) + obj[el].bubblescale;
    //obj[el].bubbleY = Math.random() * (stageH - obj[el].bubblescale * 2) + obj[el].bubblescale;

    //obj[el].x = obj[el].bubbleX;
    //obj[el].y = obj[el].bubbleY;

    //obj[el].vx = Math.round(100 - Math.random() * 100);
    //obj[el].vy = Math.round(100 - Math.random() * 100);
    //obj[el].mass = Math.round(100 - Math.random() * 100);
  });
};

/*var params = { sep: 5, randOffset: 10 };

var randInt = function (min, max) {
	return min + Math.floor(Math.random() * (max - min));
};
var getBound = function (elem, isRoot) {
	var b = elem.getBoundingClientRect();
	return {
		x: isRoot ? b.width >> 1 : (parseInt(elem.style.left) || 0),
		y: isRoot ? b.height >> 1 : (parseInt(elem.style.top) || 0),
		w: b.width,
		h: b.height,
		hw: b.width >> 1, // half-width
		hh: b.height >> 1 // half-height
	};
};
var boxCollides = function (box, boxes, parBound, sep) {
	var b1 = getBound(box);
	if (parBound) {
		if ((b1.x - b1.hw) < (parBound.x - parBound.hw)
			|| (b1.x + b1.hw) > (parBound.x + parBound.hw)
			|| (b1.y - b1.hh) < (parBound.y - parBound.hh)
			|| (b1.y + b1.hh) > (parBound.y + parBound.hh))
			return true;
	}

	for (var i = 0; i < boxes.length; i++) {
		var b2 = getBound(boxes[i]);

		var sepX = Math.max(b1.x, b2.x) - Math.min(b1.x, b2.x);
		var sepY = Math.max(b1.y, b2.y) - Math.min(b1.y, b2.y);

		if (sepX < (b1.hw + b2.hw + sep) && sepY < (b1.hh + b2.hh + sep)) return true;
	}
	return false;
};


var reposition = function (boxes, sep, randOffset) {
	console.log("reposition")
	// `sep` defines the separation between elements
	sep = (sep || 0) + 1;

	boxes = Array.prototype.slice.call(boxes);

	// Awesome (and probably bad) `shuffle` implementation
	boxes.sort(function () { return Math.random() - 0.5; });

	//var parBound = getBound(boxes[0].parentNode, true);
	var parBound = getBound(document.getElementsByClassName("ssBubbleHolder")[0], true)

	// Consider the 1st box "ready"; position it
	var numReady = 1;
	boxes[0].style.left = randInt(parBound.x - randOffset, parBound.x + randOffset) + 'px';
	boxes[0].style.top = randInt(parBound.y - randOffset, parBound.y + randOffset) + 'px';

	while (numReady < boxes.length) {

		var box = boxes[numReady];
		var bound = getBound(box);

		var x = 0;
		var y = 0;
		var attempts = 0;
		var collisionBoxes = boxes.slice(0, numReady);

		do {

			// Choose a random, "ready" box to align to
			var randInd = randInt(0, numReady);
			var alignBound = getBound(boxes[randInd]);

			// Choose a random side to align to
			var side = randInt(0, 4);
			if (side === 0) { // Align to the left
				x = alignBound.x - (alignBound.hw + bound.hw + sep);
				y = alignBound.y + randInt(-randOffset, randOffset);
			} else if (side === 1) { // Align to the right
				x = alignBound.x + (alignBound.hw + bound.hw + sep);
				y = alignBound.y + randInt(-randOffset, randOffset);
			} else if (side === 2) { // Align to the top
				y = alignBound.y - (alignBound.hh + bound.hh + sep);
				x = alignBound.x + randInt(-randOffset, randOffset);
			} else if (side === 3) { // Align to the bottom
				y = alignBound.y + (alignBound.hh + bound.hh + sep);
				x = alignBound.x + randInt(-randOffset, randOffset);
			}

			box.style.left = x + 'px';
			box.style.top = y + 'px';

		} while (attempts++ < 500 && boxCollides(box, collisionBoxes, parBound, sep));


		numReady++;

	}

}; */
