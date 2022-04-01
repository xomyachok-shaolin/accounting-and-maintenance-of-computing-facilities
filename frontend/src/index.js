import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";

import "index.css";
import { App } from "App";

// setup fake backend
// import { fakeBackend } from '_helpers';
// fakeBackend();

ReactDOM.render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
  ,
  document.getElementById("app")
);
