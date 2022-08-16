import {
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import "./index.scss";

const ScrollTo = () => {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const _y = window.pageYOffset;
    if (_y >= 350) {
      setIsTop(false);
    }
    return () => {};
  }, []);

  const onScroll = () => {
    const height = document.getElementById("root").clientHeight;
    console.log("h", height)
    document.querySelector("body").scroll({
      top: isTop ? height : 0,
      left: 0,
      behavior: "smooth",
    });
    setIsTop(!isTop);
  };

  return (
    <div className="scrollTo" style={{ opacity: 1 }}>
      {isTop ? (
        <VerticalAlignBottomOutlined
          onClick={onScroll}
          className="scrollTo-icon"
        />
      ) : (
        <VerticalAlignTopOutlined
          onClick={onScroll}
          className="scrollTo-icon"
        />
      )}
    </div>
  );
};

export default ScrollTo;
