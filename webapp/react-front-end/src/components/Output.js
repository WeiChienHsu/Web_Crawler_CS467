import React, { Component } from "react";
import { RingLoader } from "react-spinners";
import Slideshow from "./SlideShow";

class Output extends Component {
  render() {
    return (
      <div className="white ">
        {this.props.loading ? (
          <Slideshow
          loading={this.props.loading}
          />
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
