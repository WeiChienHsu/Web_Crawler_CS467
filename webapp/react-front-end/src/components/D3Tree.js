import React from "react";
import Tree from "react-d3-tree";
import Modal from "./Modal.js";

class D3Tree extends React.Component {

	state = {
		title: "node name",
		url: "url",
		direction: "horizontal",
		translate: { x: "100", y: "130" },
		treeData: {}
	};

	componentDidMount = () => {
		this.setState({
			treeData: this.props.treeData
		});

		if (this.props.algo == "BFS") {
			this.setState({
				direction: "horizontal",
				translate: { x: "100", y: "100" }
			});
		} 
		
		else if (this.props.algo == "DFS") {
			this.setState({
				direction: "vertical",
				translate: { x: "298", y: "57" }
			});
		}
	};

	componentDidUpdate = prevProps => {
		if (prevProps !== this.props) {
			this.setState({
				treeData: this.props.treeData
			});
			if (this.props.algo == "BFS") {
				this.setState({
					direction: "horizontal",
					translate: { x: "100", y: "100" }
				});
			} else {
				this.setState({
					direction: "vertical",
					translate: { x: "298", y: "57" }
				});
			}
		}
	};

	onMouseOver = (node, event) => {
		// console.log(node);
		// console.log(event);
		this.setState({
			title: node.name,
			url: node.url
		});
		document.getElementById("modal-btn").click();
	};

	render() {
		const svgRect = {
			shape: "rect",
			shapeProps: {
				width: 130,
				height: 30,
				x: 0,
				y: -20,
				fill: "lightgreen"
			}
		};

		return (
			<>
				<div
					className="row"
					id="treeWrapper"
					style={{ width: "50em", height: "20em" }}
				>
					<Tree
						data={this.state.treeData}
						nodeSvgShape={svgRect}
						direction={this.state.direction}
						zoomable="true"
						//scaleExtent={this.state.zoom}
						zoom={0.6}
						onClick={(node, e) => {
							this.onMouseOver(node, e);
						}}
						translate={this.state.translate}
					/>

					<Modal title={this.state.title} url={this.state.url} />
				</div>
			</>
		);
	}
}

export default D3Tree;
