import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Restaurant from "./Restaurant";
import "./index.css";

import { BrowserRouter as Router, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path="/" exact>
        <App />
      </Route>
      <Route path="/restaurant/:id">
        <Restaurant />
      </Route>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
