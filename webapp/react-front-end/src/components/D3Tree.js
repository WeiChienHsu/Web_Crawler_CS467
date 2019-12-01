import React from "react";
import Tree from "react-d3-tree";
import Modal from "./Modal.js";

const { getDomain } = require('tldjs');


let usedColor = ['#FF0000'];
let colorMap = new Map();

class D3Tree extends React.Component {
  state = {
    title: "title",
    name: "name",
    url: "url",
    orientation: "horizontal",
    translate: { x: 239.0, y: 157.2 },
    treeData: {},
    zoom: 0.6
  };

  getDomainName = (name) => {
    let domainName = getDomain(name);
    if (domainName != null) {
      return domainName;
    }
    return name;
  }

  componentDidMount = () => {
    let root = this.props.treeData;
    root["name"] = this.getDomainName(root.domain);
    root["nodeSvgShape"] = {
      shape: "rect",
      shapeProps: {
        width: 130,
        height: 60,
        x: 2,
        y: -40,
        fill: this.getColor(this.getDomainName(root.domain))
      }
    };
    root.children.forEach(element => {
      this.treeModifications(element);
    });

    this.setState({
      treeData: root
    });
    this.orientationSetting();
  };

  componentDidUpdate = prevProps => {
    if (prevProps !== this.props) {
      let root = this.props.treeData;
      root["name"] = this.getDomainName(root.domain);
      root["nodeSvgShape"] = {
        shape: "rect",
        shapeProps: {
          width: 130,
          height: 60,
          x: 2,
          y: -40,
          fill: this.getColor(this.getDomainName(root.domain))
        }
      };
      root.children.forEach(element => {
        this.treeModifications(element);
      });

      this.setState({
        treeData: root
      });

      this.orientationSetting();
    }
  };

  treeModifications = element => {
    // 1. The node which has children is not possible to be the node with keyword
    if (element.hasOwnProperty("children") && 
        element.children != null &&
        element.children.length != 0) 
    {
      element["name"] = this.getDomainName(element.domain);
      element["nodeSvgShape"] = {
        shape: "rect",
        shapeProps: {
          width: 130,
          height: 60,
          x: 2,
          y: -40,
          fill: this.getColor(this.getDomainName(element.domain))
        }
      };

      element.children.forEach(element => {
        this.treeModifications(element);
      });
    } 
    // 2. Each leaf node might has keyword included in BFS
    else if (element.hasOwnProperty("hasKeyword") && 
             element.hasKeyword == true) 
    {
      /* Assign different color to mark this node as last node */
      element["name"] = this.getDomainName(element.domain) + ' - Keyword';
      element["nodeSvgShape"] = {
        shape: "rect",
        shapeProps: {
          width: 180,
          height: 60,
          x: 2,
          y: -40,
          fill: "#FF0000"
        }
      }

      // Rest color map since the next searching will start with new colors set
      usedColor = ['#FF0000'];
      colorMap = new Map();
      return;
    }
    else 
    {
      element["name"] = this.getDomainName(element.domain);
      element["nodeSvgShape"] = {
        shape: "rect",
        shapeProps: {
          width: 130,
          height: 60,
          x: 2,
          y: -40,
          fill: this.getColor(this.getDomainName(element.domain))
        }
      }

      return;
    }
  };

  handleOnClick = (node, event) => {
    // console.log(node);
    // console.log(event);
    this.setState({
      title: node.title,
      name: node.name,
      url: node.url
    });
    document.getElementById("modal-btn").click();
  };

  handleOnHover = (node, event) => {
    this.setState({
      title: node.title,
      name: node.name,
      url: node.url
    });
  }

  orientationSetting = () => {
    if (this.props.algo == "BFS") {
      this.setState({
        orientation: "horizontal",
        translate: { x: 239.05, y: 297.2 }
      });
    } else if (this.props.algo == "DFS") {
      this.setState({
        orientation: "vertical",
        translate: { x: 363, y: 73.2 }
      });
    }
  };

  transferOrientation = () => {
    if (this.state.orientation == "horizontal") {
      this.setState({
        orientation: "vertical",
        translate: { x: 363, y: 73.2 }
      })
    }
    else {
      this.setState({
        orientation: "horizontal",
        translate: { x: 239.05, y: 297.2 }
      });
    }
  }

  zoomHandle = z => {
    let zooming = this.state.zoom;
    if (z == "-" && zooming > 0) {
      zooming -= 0.2;
    } else if (z == "+" && zooming < 1) {
      zooming += 0.2;
    }
    this.setState({
      zoom: zooming
    });
  };

  getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  getColor = (domain) => {

    const redFamily = ['#D0312D', '#990F02', '#E3242B', '#60100B',
                  '#541E1B', '#610C04', '#B90E0A', '#900603',
                  '#900D09', '#4E0707', '#7E2811', '#A91B0D',
                  '#420C09', '#710C04', '#5E1916', '#7A1712',
                  '#680C07', '#BC544B', '#D21404', '#9B1003']
    
    if(colorMap.has(domain)) {
      // Used the color in the map
      return colorMap.get(domain)
    }
    else {
      // Get a random color
      let color = this.getRandomColor();
      // Check if the color has been used or in the red family
      while(usedColor.includes(color) || redFamily.includes(color)) {
        color = this.getRandomColor();
      }

      // Add Color in the Map
      colorMap.set(domain, color);
      usedColor.push(domain)
      return color;
    }


  }

  render() {
    return (
      <>
        <div className="green container">
          <p className="text-center m-2">
            Current Title: <strong>{this.state.title}</strong><br></br>
            Cuurent URL: <strong>{this.state.url}</strong>
          </p>
        </div>
        <div
          className="row mb-1 "
          id="treeWrapper"
          style={{ width: "80em", height: "34em" }}
        >
          <Tree
            data={this.state.treeData}
            orientation={this.state.orientation}
            zoomable={true}
            collapsible={false}
            zoom={this.state.zoom}
            onClick={(node, e) => {
              this.handleOnClick(node, e);
            }}
            onMouseOver={(node, e) => {
              this.handleOnHover(node, e);
            }}
            translate={this.state.translate}
          />

          <Modal
            title={this.state.title}
            url={this.state.url}
            name={this.state.name}
          />
        </div>

        <div className="row mb-2 d-flex justify-content-end w-100 ">
          <div className="mr-5">
            <button
              className="mr-1 btn btn-danger"
              onClick={() => {
                this.transferOrientation();
              }}
            >
              Transfer orientation
            </button>
            <button
              className="mr-1 btn btn-secondary"
              onClick={() => {
                this.zoomHandle("-");
              }}
            >
              Zoom -
            </button>
            <button
              className="btn btn-success"
              onClick={() => {
                this.zoomHandle("+");
              }}
            >
              Zoom +
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default D3Tree;