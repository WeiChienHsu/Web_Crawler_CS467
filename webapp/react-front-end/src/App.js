import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import axios from "axios";
import cookie from "react-cookies";
import "./App.css";
import HistoryModal from "./components/HistoryModal";
import Navbar from "./components/Navbar";
import Instructions from "./components/Instructions";
import Output from "./components/Output";
import Graph from "./components/D3Graph";
import Tree from "./components/D3Tree";
import { bfs } from "./components/bfsData";
import { dfs } from "./components/dfsData";

class App extends Component {
  state = {
    algo: "BFS",
    url: "",
    keyword: "",
    depth_options: [],
    depth: "1",
    loading: false,
    error: "",
    output: false,
    response_error: false,
    dataloaded: false,
    graph_data: {
      edges: [],
      nodes: []
    },
    history: []
  };

  componentDidMount = () => {
    this.updateDepthOptions();
    if (cookie.load("userHistory")) {
      this.setState({ history: cookie.load("userHistory") });
    } else {
      cookie.save("userHistory", [], { path: "/" });
    }
  };

  updateDepthOptions = () => {
    let options = [];
    let highend = this.state.algo === "BFS" ? 5 : 21;
    for (let i = 1; i < highend; i++) {
      options.push(i);
    }
    this.setState({
      depth_options: [...options]
    });
  };

  refresh = () => {
    this.setState(
      {
        algo: "BFS",
        url: "",
        keyword: "",
        depth_options: [],
        depth: "1",
        loading: false,
        error: "",
        output: false,
        response_error: false
      },
      () => this.updateDepthOptions()
    );
  };

  search = () => {
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    this.setState(
      {
        error: this.state.url.match(regex) ? "" : "Please enter a valid URL"
      },
      () => {
        if (this.state.error.length === 0) {
          this.setState({
            loading: true,
            output: true
          });
          let postfix = this.state.algo === "BFS" ? "bfsData" : "dfsData";
          let body = {
            url: this.state.url,
            depth: this.state.depth,
            keyword: this.state.keyword
          };
          axios
            .post(`https://visualiz.appspot.com/${postfix}`, body)
            .then(res => {
              if (res.status !== 201) {
                this.setState({
                  response_error: true,
                  loading: false
                });
              } else if (res.status === 201) {
                let history = cookie.load("userHistory");
                history.push({
                  algorithm: this.state.algo,
                  url: this.state.url,
                  depth: this.state.depth,
                  keyword: this.state.keyword
                });
                cookie.save("userHistory", history, { path: "/" });

                let display_data = this.state.algo === "BFS" ? bfs :dfs;

                this.setState(
                  {
                    graph_data: display_data,
                    loading: false,
                    dataloaded: true,
                    history: cookie.load("userHistory")
                  },
                  () => console.log(this.state.graph_data)
                );
              }
            });
        }
      }
    );
  };

  onClearHistory = () => {
    cookie.save("userHistory", [], { path: "/" });
    this.setState({
      history: cookie.load("userHistory")
    });
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="containerColor pl-5 pr-5 pt-2 pb-1">
          <Instructions />
          <div className="mt-5 row ml-0 mr-0">
            <select
              className="form-control col-md-1"
              value={this.state.algo}
              onChange={e =>
                this.setState({ algo: e.target.value }, () =>
                  this.updateDepthOptions()
                )
              }
            >
              <option value="BFS">BFS</option>
              <option value="DFS">DFS</option>
            </select>
            <input
              type="text"
              className="form-control col-md-7"
              placeholder="www.google.com"
              value={this.state.url}
              onChange={e => this.setState({ url: e.target.value, error: "" })}
            />
            <select
              className="form-control col-md-1"
              value={this.state.depth}
              onChange={e => this.setState({ depth: e.target.value })}
            >
              {this.state.depth_options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control col-md-3"
              placeholder="keywords..."
              value={this.state.keyword}
              onChange={e => this.setState({ keyword: e.target.value })}
            />
          </div>
          {this.state.error.length > 0 && (
            <p className="text-center error">{this.state.error}</p>
          )}
          <div className="d-flex justify-content-end mt-2">
            <button className="btn btn-secondary mr-2" onClick={this.refresh}>
              Refresh
            </button>
            <button
              className="btn large-button btn-success"
              onClick={this.search}
            >
              Search
            </button>
          </div>
          <div className="row">
            {this.state.dataloaded && (
              <Tree algo={this.state.algo} treeData={this.state.graph_data} />
            )}
          </div>
          {this.state.output && (
            <Output
              loading={this.state.loading}
              response_error={this.state.response_error}
            />
          )}
        </div>
        <HistoryModal
          onClearHistory={this.onClearHistory}
          history={this.state.history}
        />
      </>
    );
  }
}

export default App;
