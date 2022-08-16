import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const Delay = (props) => {
  const { wait } = props;
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaiting(false);
    }, wait);
    return () => {
      clearTimeout(timer);
    };
  }, [wait]);

  return waiting === true ? null : props.children;
};

Delay.propTypes = {
  wait: PropTypes.number,
};

export default Delay;
