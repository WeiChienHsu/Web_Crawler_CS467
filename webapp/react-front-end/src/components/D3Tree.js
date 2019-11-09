import React from "react";
import Tree from "react-d3-tree";
import Modal from "./Modal.js";

class D3Tree extends React.Component {
  state = {
    title: "title",
    name: "name",
    url: "url",
    direction: "horizontal",
    translate: { x: 239.0, y: 157.2 },
    treeData: {},
    zoom: 0.6
  };

  componentDidMount = () => {
    let root = this.props.treeData;
    root["name"] = root.domainName;
    root["nodeSvgShape"] = {
      shape: "rect",
      shapeProps: {
        width: 130,
        height: 30,
        x: 0,
        y: -20,
        fill: this.getRandomColor()
      }
    };
    root.children.forEach(element => {
      this.treeModifications(element);
    });

    this.setState({
      treeData: root
    });
    this.directionSetting();
  };

  componentDidUpdate = prevProps => {
    if (prevProps !== this.props) {
      let root = this.props.treeData;
      root["name"] = root.domainName;
      root["nodeSvgShape"] = {
        shape: "rect",
        shapeProps: {
          width: 130,
          height: 30,
          x: 0,
          y: -20,
          fill: this.getRandomColor()
        }
      };
      root.children.forEach(element => {
        this.treeModifications(element);
      });

      this.setState({
        treeData: root
      });

      this.directionSetting();
    }
  };

  treeModifications = element => {
    if (element.hasOwnProperty("children") && element.children != null) {
      console.log("have");

      element["name"] = element.domainName;
      element["nodeSvgShape"] = {
        shape: "rect",
        shapeProps: {
          width: 130,
          height: 30,
          x: 0,
          y: -20,
          fill: this.getRandomColor()
        }
      };

      element.children.forEach(element => {
        this.treeModifications(element);
      });
    } else {
      element["name"] = element.domainName;
      element["nodeSvgShape"] = {
        shape: "rect",
        shapeProps: {
          width: 130,
          height: 30,
          x: 0,
          y: -20,
          fill: this.getRandomColor()
        }
      };

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

  directionSetting = () => {
    if (this.props.algo == "BFS") {
      this.setState({
        direction: "horizontal",
        translate: { x: 239.05, y: 157.2 }
      });
    } else if (this.props.algo == "DFS") {
      this.setState({
        direction: "vertical",
        translate: { x: 363, y: 73.2 }
      });
    }
  };

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

  render() {
    return (
      <>
        <div
          className="row mb-1 "
          id="treeWrapper"
          style={{ width: "80em", height: "20em" }}
        >
          <Tree
            data={this.state.treeData}
            direction={this.state.direction}
            zoomable={true}
            collapsible={false}
            zoom={this.state.zoom}
            onClick={(node, e) => {
              this.handleOnClick(node, e);
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
