import React from "react";

const Section = (props) => {
  const { children } = props;
  return <div className="section">{children}</div>;
};

export default Section;
