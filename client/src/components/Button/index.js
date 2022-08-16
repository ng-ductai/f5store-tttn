import React from "react";

const Button = (props) => {
  const { bgBtn, size, icon, animate, onclick, children, width } = props;
  const bg = bgBtn ? `bg-${bgBtn}` : "bg-main";
  const sz = size ? `btn-${size}` : "";
  const anmt = animate ? "btn-animate" : "";

  return (
    <button
      className={`btn ${bg} ${sz} ${anmt}`}
      onClick={onclick ? () => onclick() : null}
      style={{ width: width }}
    >
      <span className="btn__txt">{children}</span>
      
      {icon ? (
        <span className="btn__icon">
          <i className={`fas fa-${icon} move`}></i>
        </span>
      ) : null}
    </button>
  );
};

export default Button;
