import { convertProductKey, convertProductBrand } from "../../../../helpers";
import PropTypes from "prop-types";
import React from "react";

// lấy danh sách thông số
const listSpecification = (data) => {
  let result = [];
  for (let key in data) {
    if (typeof data[key] === "object") {
      for (const k in data[key]) {
        result.push({ key: convertProductKey(k), value: data[key][k] });
      }
      continue;
    }
    result.push({ key: convertProductKey(key), value: data[key] });
  }
  return result;
};

// show danh sách
const showSpecification = (list) => {
  return (
    list &&
    list.map((item, index) => (
      <div key={index} className="specification-item">
        <span className="flex2">{item.key}</span>
        <span className="flex3">{item.value}</span>
      </div>
    ))
  );
};

const Specification = (props) => {
  const { data } = props;
  const { warranty, brand, ...rest } = data;
  const list = [...listSpecification(rest)];

  return (
    <div className="specification">
      <div className="specification-item">
        <span className="font-size-16px flex2">Thương hiệu</span>
        <span className="font-size-16px flex3">
          {convertProductBrand(brand)}
        </span>
      </div>

      {showSpecification(list)}

      <div className="specification-item">
        <span className="font-size-16px flex2">Bảo hành</span>
        <span className="font-size-16px flex3">{warranty} tháng</span>
      </div>
    </div>
  );
};

Specification.propTypes = {
  data: PropTypes.object,
};

export default Specification;
