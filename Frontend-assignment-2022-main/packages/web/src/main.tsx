import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Restaurant from "./Restaurant";
import "./index.css";

import { BrowserRouter as Router, Route } from "react-router-dom";

ReactDOM.render(
  <div className="w-full mx-auto max-w-7xl p-4">
    <div className="w-full text-center">
      <h1 className="text-3xl">LINE MAN Wongnai Frontend Assignment!</h1>
    </div>
    <React.StrictMode>
      <Router>
        <Route path="/" exact>
          <App />
        </Route>
        <Route path="/restaurant/:id">
          <Restaurant />
        </Route>
      </Router>
    </React.StrictMode>
  </div>,
  document.getElementById("root")
);
