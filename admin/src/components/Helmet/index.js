import React from "react";
import PropTypes from "prop-types";

const Helmet = (props) => {
  const { title, children } = props;
  document.title = "F5 Store - " + title;

  return <div>{children}</div>;
};

Helmet.propTypes = {
  title: PropTypes.string.isRequired,
};

Helmet.defaultProps = {
  titles: "",
};

export default Helmet;
