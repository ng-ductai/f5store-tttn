import React from "react";
import configStore from "../src/configs/configureStore";
import App from "../src/pages/App";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

const store = configStore();

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
