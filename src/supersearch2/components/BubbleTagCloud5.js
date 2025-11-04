import React, { Component } from "react";
import * as d3 from "d3";
import * as _ from "lodash";
// For the default version
import algoliasearch from "algoliasearch";

let values, min, max, total, tagName;

let alphaTargetVal = 0.3;
var bubbleScrollWidth = 3000;

var clusters = new Array(3);

var maxRadius = 100;
var padding = 20;

var foci;

//https://codepen.io/pravid/pen/abyJKYE?editors=1010
//http://bl.ocks.org/eesur/be2abfb3155a38be4de4
//https://codepen.io/pravid/pen/bGrJmmd

export default class BubbleTagCloud extends Component {
  constructor(props) {
    super(props);

    this.state = {
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      sizeDivisor: 0.5,
      color: null,
      nodePadding: 20,
      width: "100%",
      height: "0",
      values: null,
      min: 0,
      max: 0,
      total: 0,
      tagName: props.tagName,
    };
  }

  componentDidMount() {
    const { data, allTagsData } = this.props;
    //window.addEventListener("resize", this.handleResize);
    this.setState({
      color: d3.scaleOrdinal(["#597EF7", "#9254DE"]),
    });
    this.simulation = d3.forceSimulation();
    let tempData = allTagsData; //data;
    if (tempData.length > 0) {
      tempData.forEach((d) => {
        //d.size = d.rad;
        //d.radius = d.rad;
        d.radius = d.count;
        d.size = +d.radius * 1;
        d.size < 1 ? (d.radius = 1) : (d.radius = d.size);
        d.id = d.isRefined ? 0 : d.isActive ? 1 : 2;
        var clusterVal = d.isRefined ? 0 : d.isActive ? 1 : 2;
        d.cluster = clusterVal;
        if (!clusters[clusterVal] || d.radius > clusters[clusterVal].radius)
          clusters[clusterVal] = d;
      });
      this.graphdata = tempData;
      this.graphdata = tempData.sort((a, b) => {
        return b.size - a.size;
      });

      this.createBubblePlot(this.graphdata);
    }

    /* /// this is just test for passing multiple objectid to algolia and get data back to be used in spotify search
    // For the default version
    const algoliasearch = require('algoliasearch');
    const client = algoliasearch('TMNFOGBBKY', '6f8709fb3da004aadd10b5595d7c4b54');
    const index = client.initIndex('dev_Songs');
    //get track by id
    index.getObjects(['200', '201']).then(({ results }) => {
     // console.log("OBJ---", results);
    });

    //get list of all tags
    const searchClient = algoliasearch('TMNFOGBBKY', '6f8709fb3da004aadd10b5595d7c4b54');

    index.search('', {
      //facets: [*],
      facets: ['tag_tonality', 'tag_feelings', 'tag_genre'],
    })
      .then((res) => {
        //console.log(res.facets);
      });
    /// this is just test for passing multiple objectid to algolia and get data back */
  }

  componentDidUpdate(prevProps) {
    const { data, allTagsData } = this.props;
    if (!_.isEqual(prevProps.data, this.props.data)) {
      let tempData = allTagsData; //data;
      if (tempData.length > 0) {
        tempData.forEach((d) => {
          //d.size = d.rad;
          //d.radius = d.rad;
          d.radius = d.count;
          d.size = +d.radius * 1;
          d.size < 1 ? (d.radius = 1) : (d.radius = d.size);
          d.id = d.isRefined ? 0 : d.isActive ? 1 : 2;
          var clusterVal = d.isRefined ? 0 : d.isActive ? 1 : 2;
          d.cluster = clusterVal;
          if (!clusters[clusterVal] || d.radius > clusters[clusterVal].radius)
            clusters[clusterVal] = d;
        });
        this.graphdata = tempData;
        this.graphdata = tempData.sort((a, b) => {
          return b.size - a.size;
        });
        this.createBubblePlot(this.graphdata);
      }
    }
  }

  createBubblePlot(data) {
    var ssFilterItemsRefined = data.filter((item) => {
      if (item.isRefined == true && item.isActive == true) return item;
    });
    // console.log("ssFilterItemsRefined ", ssFilterItemsRefined);
    var ssFilterItemsNotRefined = data.filter((item) => {
      if (item.isRefined == false && item.isActive == true) return item;
    });
    // console.log("ssFilterItemsNotRefined ", ssFilterItemsNotRefined);
    var ssFilterItemsNotActive = data.filter((item) => {
      if (item.isActive == false) return item;
    });
    // console.log("ssFilterItemsNotRefined ", ssFilterItemsNotActive);

    data = [
      ...ssFilterItemsRefined,
      ...ssFilterItemsNotRefined,
      ...ssFilterItemsNotActive,
    ];

    //data = [...ssFilterItemsRefined, ...ssFilterItemsNotRefined.slice(0,20), ...ssFilterItemsNotActive]

    values = data.map((d) => d.count);
    min = Math.min.apply(null, values);
    max = Math.max.apply(null, values);
    total = data.length;

    tagName = this.props.tagName;

    let linearScale = d3.scaleLinear().domain([min, max]).range([40, 100]);
    var xScale = d3.scaleLinear().domain([0, 1, 2]).range([0, 500, 1000]);

    const node = this.node;
    d3.select(node).selectAll("g").remove();
    //const width = this.props.width - this.state.margin.left - this.state.margin.right;
    const width =
      bubbleScrollWidth - this.state.margin.left - this.state.margin.right;
    const height =
      this.props.height - this.state.margin.top - this.state.margin.bottom;

    /* let extentCount = d3.sort(nodes, d => {
      return [100,1000]
      if(d.isRefined) return -1;
      else if(d.isActive) return 0;
      else return 1;
      })
    let xScale1 = d3.scaleLinear().domain(extentCount).range([(width - maxRadius), maxRadius])
 */

    this.simulation
      .force(
        "forceX",
        d3
          .forceX(0)
          .strength(0.1)
          .x(width * 0.5)
      )
      .force(
        "forceY",
        d3
          .forceY(0)
          .strength(1)
          .y(height * 0.55)
      )
      .force("charge", d3.forceManyBody(1).strength(5));

    //.force("forceX", d3.forceX().strength(0.051).x(d => xScale1(d.radius)))

    //.force('x', d3.forceX(50).x(function(d) { return xScale((d.radius));  }))

    //.force("center", d3.forceCenter().x(width * 0.5).y(height * 0.5))

    //.force('x', d3.forceX().x(function(d) { return 0 }))
    //.force('y', d3.forceY().y(function(d) { return height * 0.5 }))

    /* var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().stre2ngth(5))
      .force('x', d3.forceX().x(function(d) { return 0 }))      
      .force('y', d3.forceY().y(function(d) {return 0; }))
      .force('collision', d3.forceCollide().radius(function(d) { return d.radius; })) */

    let nodeg = d3
      .select(node)
      .attr("width", width + this.state.margin.left + this.state.margin.right)
      .attr("height", height + this.state.margin.top + this.state.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" +
          this.state.margin.left +
          "," +
          this.state.margin.top +
          ")"
      );

    let nodes = null;
    let nodestext1 = null;
    let nodestextTick = null;
    let nodeinnercircle = null;
    let nodestext2 = null;

    if (ssFilterItemsRefined.length == 0) {
      foci = [
        { x: 50, y: 150 },
        { x: 500, y: 150 },
        { x: 1500, y: 150 },
      ];
    } else {
      foci = [
        { x: 50, y: 150 },
        { x: 800, y: 150 },
        { x: 1500, y: 150 },
      ];
    }

    var x = d3
      .scaleLinear()
      .domain([0, 5])
      .range([
        this.state.margin.left,
        bubbleScrollWidth + this.state.margin.right,
      ]);

    this.simulation
      .nodes(data)
      .force(
        "collide",
        d3
          .forceCollide((d) => {
            return 120;
          })
          .strength(0.9)
          .radius((d) => {
            //return linearScale(d.radius)
            return linearScale(d.radius) + this.state.nodePadding;
            //return (width / height / 2) * linearScale(d.radius) + this.state.nodePadding;
          })
          .iterations(100)
      )
      .on("tick", function (d) {
        //console.log("tick",d)
        var a = 0.5; //e.alpha;
        var collideVal = 0.5;

        nodes
          //.each(collide(collideVal, nodes))
          .each(gravity(0.5 * a))
          .attr("cx", (d) => {
            return (d.x = Math.max(
              linearScale(d.radius),
              Math.min(bubbleScrollWidth - linearScale(d.radius), d.x)
            ));
          })
          //.attr("cy", (d) => { return d.y = Math.max(linearScale(d.radius), Math.min(height - linearScale(d.radius), d.y)); })
          //.attr("cx", (d) => { return brownian(d.x, a); })
          //  .attr("cy", (d) => { return brownian(d.y, a); });
          //.attr("cx", (d) => { return d.x; })
          .attr("cy", (d) => {
            return d.y;
          });

        nodestextTick
          //.each(collide(collideVal, nodestextTick))
          .each(gravity(0.5 * a))
          .attr("x", (d) => {
            return (d.x = Math.max(
              linearScale(d.radius),
              Math.min(bubbleScrollWidth - linearScale(d.radius), d.x)
            ));
          })
          // .attr("y", (d) => { return d.y = Math.max(linearScale(d.radius), Math.min(height - linearScale(d.radius), d.y)); })
          //.attr("x", (d) => { return brownian(d.x, a); })
          //   .attr("y", (d) => { return brownian(d.y, a); });
          // .attr("x", (d) => { return d.x; })
          .attr("y", (d) => {
            return d.y;
          });

        nodestext1
          //.each(collide(collideVal, nodestext1))
          .each(gravity(0.5 * a))
          .attr("x", (d) => {
            return (d.x = Math.max(
              linearScale(d.radius),
              Math.min(bubbleScrollWidth - linearScale(d.radius), d.x)
            ));
          })
          // .attr("y", (d) => { return d.y = Math.max(linearScale(d.radius), Math.min(height - linearScale(d.radius), d.y)); })
          // .attr("x", (d) => { return brownian(d.x, a); })
          // .attr("y", (d) => { return brownian(d.y, a); });
          //  .attr("x", (d) => { return d.x; })
          .attr("y", (d) => {
            return d.y;
          });

        var alphaVal = Math.random() * 0.1;
        alphaVal = 0.2;

        nodes.each(function (o, i) {
          //console.log("foc",i )
          if (o.id == 0) {
            o.y += (foci[o.id].y - o.y) * alphaVal * 1.5;
            o.x += (foci[o.id].x - o.x) * alphaVal * 1.6;
          } else if (o.id == 1) {
            o.y += (foci[o.id].y - o.y) * alphaVal * 1.5;
            o.x += (foci[o.id].x - o.x) * alphaVal * 0.2;
          } else {
            o.y += (foci[o.id].y - o.y) * alphaVal * 0.2;
            o.x += (foci[o.id].x - o.x) * alphaVal * 0.6;
            //o.x += (foci[o.id].x - o.x) * 0.2;
            //o.x += (linearScale(clusters[1].radius)+foci[o.id].x - o.x) * 0.05;
          }
        });
      });

    var brownian = (function (w) {
      return function (x, a) {
        return x + (Math.random() - 0.5) * w * a;
      };
    })(10);

    let nodedata = nodeg.selectAll(".bubbleBox").data(data).enter();

    nodes = nodedata
      .append("circle")
      .attr("r", (d) => {
        return linearScale(d.radius);
      })
      .attr("fill", (d) => {
        if (!d.isActive) return "var(--color-gray)";
        else return `var(--color-bubbletag-` + tagName + `-bg)`;
      })
      // .attr("stroke", (d) => {
      // if (!d.isActive) return "var(--color-gray)";
      // else return `var(--color-primary)`;
      // })
      .attr("class", "bubbleBox")
      .attr("fill-opacity", (d) => {
        if (!d.isActive) return 0.2;
        else if (d.radius) {
          //return 1;
          return `var(--opacity-bubbletag-` + tagName + `)`;
        } else {
          return 1;
        }
      })
      .attr("cx", (d) => {
        return d.x;
      })
      .attr("cy", (d) => {
        return d.y;
      })
      .on("click", this.bubbleClick)
      //.call(d3.drag)
      .call(
        d3
          .drag()
          .on("start", this.dragstarted)
          .on("drag", this.dragged)
          .on("end", this.dragended)
      );

    nodes
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .attr("r", (d) => {
            return linearScale(d.radius) * 1.3;
          });
      })
      .on("mouseleave", function () {
        d3.select(this)
          .transition()
          .attr("r", (d) => {
            return linearScale(d.radius);
          });
      });
    let nodetxt = nodeg.selectAll("text").data(data).enter();

    nodestextTick = nodetxt
      .append("text")
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y;
      })
      .attr("dy", "0em")
      .attr("class", "bubbleBoxTextTick")
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .style("font-size", "25px")
      .html(getTickMarkText)
      .attr("fill", (d) => {
        return `var(--color-bubbletag-${tagName}-text)`;
      });

    nodestext1 = nodetxt
      .append("text")
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y;
      })
      //.attr("dy", ".3em")
      .attr("dy", ".8em")
      .attr("class", "bubbleBoxText")
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .style("font-size", getFontSizeForItem)
      .text(getLabel)
      //.text(function (d) { return `${d.label} (${d.count})`;  })
      .attr("fill", (d) => {
        return `var(--color-bubbletag-${tagName}-text)`;
      });

    this.simulation.alphaTarget(alphaTargetVal).restart();
  }

  dragstarted = (e, d) => {
    if (!e.active) this.simulation.alphaTarget(alphaTargetVal).restart();
    d.fx = e.x;
    d.fy = e.y;
  };

  dragged = (e, d) => {
    d.fx = e.x;
    d.fy = e.y;
  };

  dragended = (e, d) => {
    if (!e.active) this.simulation.alphaTarget(alphaTargetVal);
    d.fx = null;
    d.fy = null;
  };

  render() {
    return (
      <div
        style={{
          height: this.props.height,
          //width: this.props.width,
        }}
      >
        <svg
          style={{
            height: this.props.height,
            width: bubbleScrollWidth,
            //viewBox: '0 0 1260 500'
          }}
          ref={(node) => (this.node = node)}
        ></svg>
      </div>
    );
  }

  handleResize = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    this.createBubblePlot(this.graphdata);
    this.forceUpdate();
  };

  bubbleClick = (e, data) => {
    //console.log(data.label)
    if (data) {
      if (data.label !== "" && data.label !== " " && data.isActive) {
        if (this.props.onBubbleClick) {
          this.props.onBubbleClick(data);
        }
      }
    }
  };
}

function getFontSizeForItem(item) {
  return getFontSize(item.count, min, max, total);
}
function getFontSize(value, min, max, total) {
  //return Math.min(2 * value, (2 * value - 8) / this.getComputedTextLength() * 24) + "px";
  const minPx = 12;
  const maxPx = 18;
  const pxRange = maxPx - minPx;
  const dataRange = max - min;
  const ratio = pxRange / dataRange;
  const size = Math.min(maxPx, Math.round(value * ratio) + minPx);
  return `${size}px`;
}

function getTickMarkText(item) {
  if (item.isActive) {
    return item.isRefined ? "&#10003;" : "";
  } else return "";
}

function getLabel(item) {
  return truncate(item.displayLabel);
  /* if (item.count < max / 3.3) {
    return '';
  }
  return truncate(item.label); */
}
function getValueText(item) {
  return `(${item.count})`;
  /*  if (item.count < max / 3.3) {
     return '';
   }
   return `(${item.count})`; */
}
function truncate(label) {
  const max = 11;
  if (label.length > max) {
    label = label.slice(0, max) + "...";
  }
  return label;
}

// Resolves collisions between d and all other circles.
function collide(alpha, nodes) {
  var quadtree = d3.quadtree(nodes);
  return function (d) {
    var r = d.radius + maxRadius + padding,
      nx1 = d.x - r,
      nx2 = d.x + r,
      ny1 = d.y - r,
      ny2 = d.y + r;
    quadtree.visit(function (quad, x1, y1, x2, y2) {
      if (quad.point && quad.point !== d) {
        var x = d.x - quad.point.x,
          y = d.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + quad.point.radius + padding;
        if (l < r) {
          l = ((l - r) / l) * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

function gravity(alpha) {
  return function (d) {
    d.y += ((foci[d.id].y - d.y) * alpha) / 50;
    d.x += ((foci[d.id].x - d.x) * alpha) / 50;
  };
}
