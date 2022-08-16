import React from "react";
import { Link } from "react-router-dom";
import Button from "../../Button";
import { convertColorSlider } from "../../../helpers";

const HeroSlidesItem = (props) => {
  const { item, active } = props;
  const color = convertColorSlider(item.color);

  return (
    <div className={`slides__item ${active ? "active" : ""}`}>
      <div className="slides__item__info">
        <div className={`slides__item__info__title color-${color}`}>
          <span>{item.title}</span>
        </div>
        <div className="slides__item__info__description">
          <span>{item.description}</span>
        </div>
        <div className="slides__item__info__btn">
          <Link to={item.path}>
            <Button bgBtn={color}> See detail </Button>
          </Link>
        </div>
      </div>
      <div className="slides__item__image">
        <div className={`shape bg-${color}`}></div>
        <img alt={item.title} src={item.image} />
      </div>
    </div>
  );
};

export default HeroSlidesItem;
