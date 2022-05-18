import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";

import { ConfigProvider  } from 'antd';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import 'moment/locale/ru';

import "index.css";
import { App } from "App";

// setup fake backend
// import { fakeBackend } from '_helpers';
// fakeBackend();

ReactDOM.render(
    <RecoilRoot>
    <ConfigProvider  locale={ru_RU}><App /></ConfigProvider>;
    </RecoilRoot>
  ,
  document.getElementById("app")
);
