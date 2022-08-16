import React from "react";

const Policy = (props) => {
  const { name, description, icon, onClick } = props;
  return (
    <div className="policy bg-white bor-rad-6" onClick={onClick}>
      <div className="policy-icon">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div className="policy-info">
        <div className="policy-info__name">{name}</div>
        <div className="policy-info__description">{description}</div>
      </div>
    </div>
  );
};

export default Policy;
