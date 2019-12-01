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
import Tree from "./components/D3Tree";
import mockDfsData from "./mockData/mockDFS.json"
import mockBfsData from "./mockData/mockBFS.json"


function convertURL(url) {
  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
  }
  return url;
}

class App extends Component {
  state = {
    algo: "BFS",
    url: "",
    keyword: "",
    depth_options: [],
    depth: 1,
    loading: false,
    error: "",
    output: false,
    response_error: false,
    dataloaded: false,
    disabled: false,
    graph_data: {},
    history: [],
    server_error: "",
    graph: false
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
    let highend = this.state.algo === "BFS" ? 4 : 21;
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
        depth: 1,
        loading: false,
        error: "",
        output: false,
        response_error: false,
        disabled: false,
        dataloaded: false,
        server_error:"",
        graph: false
      },
      () => this.updateDepthOptions()
    );
  };

  offlineSearch = () => {
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    this.setState(
      {
        output: false,
        graph: false,
        error: this.state.url.match(regex) ? "" : "Please enter a valid URL"
      },
      () => {
        if (this.state.error.length === 0) {
          this.setState({
            loading: true,
            output: true
          });

          /* Serach if the URL in the history */
          let history = cookie.load("userHistory");

          const offline_search_url = this.state.url;
          const offline_search_keyword = this.state.keyword;
          const offline_search_algo = this.state.algo;

          for (var i = 0; i < history.length; i++) {
            if (offline_search_url == history[i].results.search_url && 
                offline_search_keyword == history[i].results.search_keyword &&
                offline_search_algo == history[i].results.search_algo) 
            {
              this.setState(
                {
                  graph_data: history[i].results.search_result,
                  loading: false,
                  dataloaded: true,
                  disabled: true,
                  response_error: false,
                  graph: true
                },
                () => console.log(this.state.graph_data)
              );
              return;
            }
          }

          const server_error_message = "There is no recored for URL: " + offline_search_url +  " and Keyword: " + this.state.keyword  + " in the cookie.";
          this.setState({
            response_error: true,
            loading: false,
            server_error: server_error_message
          })
          return;
      }
    }
    );
};

  search = () => {
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    this.setState(
      {
        output: false,
        error: this.state.url.match(regex) ? "" : "Please enter a valid URL",
        graph: false
      },
      () => {
        if (this.state.error.length === 0) {
          this.setState({
            loading: true,
            output: true
          });
          let postfix = this.state.algo === "BFS" ? "bfsData" : "dfsData";

          let body = 
          {
            url: convertURL(this.state.url),
            depth: this.state.depth,
            keyword: this.state.keyword
          };
          
          axios
            .post(`https://visualizers-rest-api.appspot.com/${postfix}`, body)
            .then(res => {
             if (res.status === 201 || res.status === 200) {
                let history = cookie.load("userHistory");
                
                const searchResult = 
                {
                  "search_algo": this.state.algo,
                  "search_keyword": this.state.keyword,
                  "search_url": this.state.url,
                  "search_result": res.data
                }

                history.push({
                  algorithm: this.state.algo,
                  url: this.state.url,
                  depth: this.state.depth,
                  keyword: this.state.keyword,
                  results: searchResult
                });
                
                cookie.save("userHistory", history, { path: "/" });

                this.setState(
                  {
                    graph_data: res.data,
                    loading: false,
                    dataloaded: true,
                    history: cookie.load("userHistory"),
                    disabled: true,
                    response_error: false,
                    graph: true
                  },
                  () => console.log(this.state.graph_data)
                );
              }
            })
            .catch((error) => {
              console.log(error)
              let server_error_message = "";
              if( error.response == undefined) {
                server_error_message = "There are some issues from the client. Please try again later."
              }
              else {
                server_error_message = error.response.data.Error == undefined 
                ? "There are some issues from the server. Please try again later." :
                error.response.data.Error;
              }
              // console.log("err: " + error.response.data.Error);
              this.setState({
                response_error: true,
                loading: false,
                server_error: server_error_message
              })
              console.log(this.state.server_error);
            })
        }
      }
    );
  };

  demo = () => {
    if (this.state.error.length === 0) {

      this.setState({
        loading: true,
        output: true
      });

      let history = cookie.load("userHistory");
      const mockData = this.state.algo === "BFS" ? mockBfsData  : mockDfsData;

      const searchResult = 
      {
        "search_algo": this.state.algo,
        "search_keyword": this.state.keyword,
        "search_url": this.state.url,
        "search_result": mockData
      }

      history.push({
        algorithm: this.state.algo,
        url: "Demo:" + this.state.url,
        depth: this.state.depth,
        keyword: this.state.keyword,
        results: searchResult
      });
            
      cookie.save("userHistory", history, { path: "/" });

      setTimeout(function(){
        this.setState(
          {
            graph_data: mockData,
            loading: false,
            dataloaded: true,
            history: cookie.load("userHistory"),
            disabled: true,
            response_error: false,
            graph: true
          },
          () => console.log(this.state.graph_data)
        );
      }.bind(this), 5000);
    }
  }

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
        <div className="containerColor pl-5 pr-5 pt-2 pb-5">
          <Instructions />
          <div className="mt-5 row ml-0 mr-0">
            <select
              className="form-control col-md-1 mr-2"
              disabled={this.state.disabled}
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
              className="form-control col-md-3 mr-2"
              placeholder="www.google.com"
              value={this.state.url}
              onChange={e => this.setState({ url: e.target.value, error: "" })}
            />
            <select
              className="form-control col-md-1 mr-2"
              value={this.state.depth}
              onChange={e => this.setState({ depth: parseInt(e.target.value) })}
            >
              {this.state.depth_options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control col-md-2 mr-2"
              placeholder="keywords..."
              value={this.state.keyword}
              onChange={e => this.setState({ keyword: e.target.value })}
            />
            <button className="btn btn-secondary mr-1 " onClick={this.refresh}>
              Refresh
            </button>
            <button
              className="btn btn-success mr-1 "
              onClick={this.search}
            >
              Search
            </button>
            <button
              className="btn btn-info mr-1 "
              onClick={this.offlineSearch}
            >
              Offline Search
            </button>
            <button
              className="btn btn-primary mr-1"
              onClick={this.demo}
            >
              Demo
            </button>
          </div>
          {this.state.error.length > 0 && (
            <p className="text-center error">{this.state.error}</p>
          )}
          {this.state.output && (
            <Output
              loading={this.state.loading}
              response_error={this.state.response_error}
              server_error={this.state.server_error}
            />
          )}
        </div>
        <div className="row">
          {this.state.dataloaded && this.state.graph && (
            <Tree algo={this.state.algo} treeData={this.state.graph_data} />
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
