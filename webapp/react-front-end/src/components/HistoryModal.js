import React, { Component } from "react";

class HistoryModal extends Component {
  render() {
    return (
      <div
        className="modal fade bd-example-modal-lg"
        id="historyModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="historyModalTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg  modal-dialog-centered"
          role="document"
        >
          <div className="modal-content ">
            <div className="modal-body p-0">
              <table className="table table-bordered mb-0">
                <thead className="thead-dark">
                  <tr>
                    <th className="text-center">Search URL</th>
                    <th className="text-center">Keyword</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.history.map((his, index) => (
                    <tr key={index}>
                      <td className="text-center">{his.url}</td>
                      <td className="text-center">
                        {his.keyword.length > 0 ? his.keyword : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.props.onClearHistory}
              >
                Clear History
              </button>
              <button
                type="button"
                className="btn btn-primary"
                id="CloseModal"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HistoryModal;
