import React, { Component } from "react";
import { RingLoader } from "react-spinners";

class Output extends Component {
  render() {
    return (
      <div className="white ">
        {this.props.loading ? (
          <div className="sweet-loading ">
            <h5 className="greenish">Crawling...</h5>
            <RingLoader
              sizeUnit={"px"}
              size={80}
              color={"#28a745"}
              loading={this.props.loading}
            />
          </div>
        ) : this.props.response_error ? (
          <div className="yellow container">
              <p className="text-center m-2">
                Error Message: <strong>{this.props.server_error}</strong>
              </p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default Output;
