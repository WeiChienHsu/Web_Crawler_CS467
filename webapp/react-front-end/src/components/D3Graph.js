import React, { Component } from "react";
import { Graph } from "react-d3-graph";

class D3Graph extends Component {

  state = {
    nodes: [{ id: "Kevin" }, { id: "Vinny" }, { id: "Brenna" }],
    links: [
      { source: "Kevin", target: "Vinny" },
      { source: "Kevin", target: "Brenna" }
    ]
  };

  componentDidMount = () => {
    let tree = [];
    let head = this.props.graph_data.edges[0].source;
    tree.push({ name: this.props.graph_data.nodes[head].title, children: [] });

    this.props.graph_data.edges.forEach(element => {

      if (element.source === 0) {
        tree[0].children.push({
          name: this.props.graph_data.nodes[element.target].title,
          children: []
        });
      } 
      
      else {
        tree[0].children.forEach(ele => {
          ele.children.push({
            name: this.props.graph_data.nodes[element.target].title,
            children: []
          });
        });
      }
    });

    this.setState({
      links: this.props.graph_data.edges
    });

    let temp = [];

    this.props.graph_data.nodes.forEach(element => {
      let node = {
        id: element.index,
        title: element.title
      };
      temp.push(node);
    });

    this.setState({ nodes: temp });
  };

  componentDidUpdate = prevProps => {
    if (prevProps !== this.props) {
      this.setState({
        links: this.props.graph_data.edges
      });

      let temp = [];
      
      this.props.graph_data.nodes.forEach(element => {
        let node = {
          id: element.index,
          title: element.title
        };
        temp.push(node);
      });

      this.setState({ nodes: temp });
    }
  };

  render() {
    const data = {
      nodes: this.state.nodes,
      links: this.state.links
    };

    const myConfig = {
      automaticRearrangeAfterDropNode: false,
      collapsible: false,
      directed: true,
      focusAnimationDuration: 0.75,
      focusZoom: 1,
      height: 400,
      highlightDegree: 1,
      highlightOpacity: 1,
      linkHighlightBehavior: false,
      maxZoom: 8,
      minZoom: 0.1,
      nodeHighlightBehavior: true,
      panAndZoom: false,
      staticGraph: false,
      staticGraphWithDragAndDrop: true,
      width: 800,
      d3: {
        alphaTarget: 0.05,
        gravity: -100,
        linkLength: 100,
        linkStrength: 1
      },
      node: {
        color: "lightgreen",
        fontColor: "black",
        fontSize: 8,
        fontWeight: "normal",
        highlightColor: "SAME",
        highlightFontSize: 8,
        highlightFontWeight: "normal",
        highlightStrokeColor: "blue",
        highlightStrokeWidth: "SAME",
        labelProperty: "id",
        mouseCursor: "pointer",
        opacity: 1,
        renderLabel: true,
        size: 500,
        strokeColor: "none",
        strokeWidth: 1.5,
        symbolType: "square"
      },
      link: {
        color: "lightblue",
        fontColor: "black",
        fontSize: 8,
        fontWeight: "normal",
        highlightColor: "#d3d3d3",
        highlightFontSize: 8,
        highlightFontWeight: "normal",
        labelProperty: "label",
        mouseCursor: "pointer",
        opacity: 1,
        renderLabel: false,
        semanticStrokeWidth: false,
        strokeWidth: 2.5,
        markerHeight: 6,
        markerWidth: 6,
        type: "CURVE_SMOOTH"
      }
    };

    return (
      <div id="graph">
        <Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={data}
          config={myConfig}
        />
      </div>
    );
  }
}

export default D3Graph;
