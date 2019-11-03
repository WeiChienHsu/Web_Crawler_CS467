import React, { Component } from "react";

class Navbar extends Component {
  render() {
    return (
      <div className="pt-2 pl-4 pr-4 pb-2 navbarColor">
        <div className="row m-0 align-items-center">
          <div className="col-md-9 p-0">
            <h4 className="logo">The Visualizers</h4>
          </div>
          <div className="col-md-3 p-0 d-flex justify-content-end">
            <button
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#historyModal"
            >
              History
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
