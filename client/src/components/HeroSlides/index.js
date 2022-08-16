import React, { useCallback, useEffect, useState } from "react";
import HeroSlidesItem from "./HeroSlidesItem";

const HeroSlides = (props) => {
  const { data, control, auto, timeOut } = props;
  const timeAuto = timeOut ? timeOut : 3000;
  const [activeSlide, setActiveSlide] = useState(0);

  const prevSlide = () => {
    const index = activeSlide - 1 < 0 ? data.length - 1 : activeSlide - 1;
    setActiveSlide(index);
  };

  const nextSlide = useCallback(() => {
    const index = activeSlide + 1 === data.length ? 0 : activeSlide + 1;
    setActiveSlide(index);
  }, [activeSlide, data]);

  useEffect(() => {
    if (auto) {
      const slideAuto = setInterval(() => {
        nextSlide();
      }, timeAuto);
      return () => {
        clearTimeout(slideAuto);
      };
    }
  }, [nextSlide, timeAuto, props, auto]);

  return (
    <div className="slides">
      {data.map((item, index) => (
        <HeroSlidesItem
          key={index}
          item={item}
          active={index === activeSlide}
        />
      ))}
      {control ? (
        <div className="slides__control">
          <div className="slides__control__item" onClick={prevSlide}>
            <i className="fad fa-chevron-left"></i>
          </div>
          <div className="slides__control__index">
            <div className="index">
              {activeSlide + 1}/{data.length}
            </div>
          </div>
          <div className="slides__control__item" onClick={nextSlide}>
            <i className="fad fa-chevron-right"></i>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HeroSlides;
