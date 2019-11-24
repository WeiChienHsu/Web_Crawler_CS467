import React, { Component } from "react";

class Instructions extends Component {
  render() {
    return (
      <>
        <h1 className="text-center">How it Works</h1>
        <h4>BFS Search Method</h4>
        <p>
          The program will follow ALL links from the start page, and ALL links
          from each page it visits, until the crawler h- As reached the limit of
          pages deep, it should visit.
        </p>
        <h4>DFS Search Method</h4>
        <p>
          The program will start at the start page, randomly choose one of the
          links on that page, then follow it to the next page. Then, on the next
          page, it randomly selects a link from the options available and
          follows it. This makes a chain from the starting page. This continues
          until the program hits the page limit indicated.
        </p>
        <h4>Offline Search</h4>
        <p>
        The program will not send the request directly to the backend; instead, 
        it will search the cookies in the user's browser to explore whether there 
        is a reaching result for the combination of the URL and Keyword users have 
        been seeking before. The result will always be the latest one, no matter 
        what depth the user has chosen, but the algorithm would matter.
        </p>
      </>
    );
  }
}

export default Instructions;
