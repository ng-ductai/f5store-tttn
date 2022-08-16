import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";

const GlobalLoading = (props) => {
  return (
    <Spin
      size="large"
      className="Global-Loading trans-center"
      tip={props.content}
    />
  );
};

GlobalLoading.defaultProps = {
  content: "F5 Store Loading...",
};

GlobalLoading.propTypes = {
  content: PropTypes.string,
};

export default GlobalLoading;
