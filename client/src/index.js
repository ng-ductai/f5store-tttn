import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/pages/App";
import configStore from "../src/configs/configureStore";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./scss/index.scss";

import { Provider } from "react-redux";
const store = configStore();

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
