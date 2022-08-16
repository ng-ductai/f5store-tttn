import { PAIR_CONVERT_KEY, FILTER_BRAND_MOBILE } from "../constants/index";

// chuyển đổi 1 số keyword sang mongo key, ex: "lonhon-" => "$gte:"
const replaceMongoKeyword = (value = "") => {
  let result = value;
  PAIR_CONVERT_KEY.forEach((pair) => {
    result = result.replaceAll(pair.l, pair.r);
  });
  return result;
};

// query string: ?t=0&key=1 => [{ t:0 }, { key: 1 }]
const queryString = (query = "") => {
  if (!query || query === "") return [];
  let result = [];
  let q = query;
  // xoá ký tự '?' nếu có
  if (q[0] === "?") q = q.slice(1, q.length);
  // tách các cụm query ['t=0', 'key=1']
  const queryList = q.split("&");
  result = queryList.map((str) => {
    let res = {};
    let temp = str.split("=");
    if (temp.length <= 1) res[temp[0]] = "";
    else res[temp[0]] = temp[1];
    return res;
  });

  return result;
};

// phân tích query param url
// vd: key = p-reg-brand, value = Apple => {brand: {$regex: /^Apple$/i}}
// option p- là thuộc tính trong Product Model
const analysisQuery = (key = "", value = "") => {
  try {
    if (key === "") return;
    let result = {};

    // split '-' => ["p", "reg", "brand"]
    const options = key.split("-");

    // lấy main key là phần tử cuối trong mảng
    const mainKey = options[options.length - 1];

    // Note:nếu tồn tại "p" thì là thuộc tính của product model
    const isProductAttr = options.indexOf("p") === -1 ? false : true;

    // Note: nếu tồn tại "reg" tức là chuỗi cần bỏ vào regex
    const isRegex = options.indexOf("reg");

    // Note: nếu tồn tại "o" tức chuỗi là 1 object
    const isObject = options.indexOf("o");

    // value tồn tại ";" tức là đa giá trị
    const compositeValues = value.split(";");
    if (compositeValues.length <= 1) {
      // Note: đơn giá trị
      if (isRegex !== -1) {
        // giá trị value là 1 regex
        const newObj = {};
        newObj[mainKey] = { $regex: `${value}` };
        Object.assign(result, newObj);
      } else if (isObject !== -1) {
        //  giá trị value là 1 object
        const newObj = JSON.parse(`{${value}}`);
        result[mainKey] = newObj;
      } else {
        // không chứa key đặc biệt
        result[mainKey] = `${value}`;
      }
    } else {
      // Note: nhiều giá trị [values]
      result["$or"] = [];
      if (isRegex !== -1) {
        // giá trị value là 1 regex
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = { $regex: `${valueItem}` };
          result["$or"].push(newObj);
        });
      } else if (isObject !== -1) {
        //  giá trị value là 1 object
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = JSON.parse(`{${valueItem}}`);
          result["$or"].push(newObj);
        });
      } else {
        // không chứa key đặc biệt
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = `${valueItem}`;
          result["$or"].push(newObj);
        });
      }
    }

    // return
    return { isProductAttr, result };
  } catch (error) {
    // error
    return { isProductAttr: true, result: {} };
  }
};

// định dạng chuỗi truy vấn
const formatQueryString = (str = "") => {
  let result = str;
  // xoá tất cả ký tự đặc biệt
  result = str.replace(/[`~!@#$%^&*()_|+\-=?;:<>\\{\\}\\[\]\\\\/]/gi, "");
  // thay khoảng trắng thành dấu cộng
  result = result.replace(/[\s]/gi, "+");
  return result;
};

// thêm option vào url
const addOptionToUrl = (url, key = "", value = "") => {
  let result = url;
  let isChanged = false,
    isMatch = false;
  // tách url để phân tích
  let queryList = queryString(url);
  queryList.forEach((query) => {
    let k = Object.keys(query)[0];
    if (k === key) {
      isMatch = true;
      const valueList = query[k].split(";");
      if (valueList.indexOf(value) === -1) {
        query[k] = query[k] + ";" + value;
        isChanged = true;
      }
    }
  });
  // ! key, value thì thêm nó vào
  if (!isMatch) {
    result += `&${key}=${value}`;
  }
  // join lại
  if (isChanged) {
    result = "?";
    queryList.forEach((query) => {
      const k = Object.keys(query)[0];
      result += `${k}=${query[k]}&`;
    });
    result = result.slice(0, result.length - 1);
  }
  return result;
};

// xoá option trong url
const removeOptionToUrl = (url, key = "", value = "") => {
  let result = url;
  let isChanged = false;
  // tách url để phân tích
  let queryList = queryString(url);

  queryList.forEach((query) => {
    let k = Object.keys(query)[0];
    if (k === key) {
      query[k] = query[k].replace(
        new RegExp(`(${value});?|;?(${value})`, "gi"),
        ""
      );
      isChanged = true;
    }
  });
  // join lại
  if (isChanged) {
    result = "?";
    queryList.forEach((query) => {
      const k = Object.keys(query)[0];
      result += `${k}=${query[k]}&`;
    });
    result = result.slice(0, result.length - 1);
  }
  return result;
};

//phân tích mảng các câu query
const analysisQueryList = (queryList = []) => {
  const query = { pOption: {}, dOption: {} };
  queryList.forEach((item) => {
    const key = Object.keys(item)[0];
    const value = item[key];
    const { isProductAttr, result } = analysisQuery(key, value);
    if (isProductAttr) {
      Object.assign(query.pOption, result);
    } else Object.assign(query.dOption, result);
  });
  return query;
};

// hàm rút gọn tên sản phẩm
const reduceProductName = (name, length = 64) => {
  let result = name;
  if (name && name.length >= length) {
    result = name.slice(0, length) + "...";
  }
  return result;
};

// hàm format giá sản phẩm
const formatProductPrice = (price) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// tính tỉ lệ sao của sản phẩm [1,2,3,4,5]
const calStar = (rates) => {
  const total = rates.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let rateTotal = 0;
  for (let i = 0; i < 5; ++i) {
    rateTotal += rates[i] * (i + 1);
  }
  return rateTotal / total;
};

//chuyển nhãn hiệu từ số thành Model
const convertProductColor = (color) => {
  switch (color) {
    case 0:
      return "Bạc";
    case 1:
      return "Đen";
    case 2:
      return "Đỏ";
    case 3:
      return "Tím";
    case 4:
      return "Trắng";
    case 5:
      return "Vàng";
    case 6:
      return "Xanh dương";
    case 7:
      return "Xanh lá";
    case 8:
      return "Xám";
    default:
      return "Khác";
  }
};

//chuyển nhãn hiệu từ số thành Model
const convertProductBrand = (brand) => {
  switch (brand) {
    case "0":
      return "iPhone";
    case "1":
      return "Samsung";
    case "2":
      return "OPPO";
    case "3":
      return "Realme";
    case "4":
      return "Xiaomi";
    case "5":
      return "Sony";
    case "6":
      return "Vivo";
    case "7":
      return "Ava";
    case "8":
      return "Anker";
    case "9":
      return "Hyper";
    case "10":
      return "Belkin";
    case "11":
      return "Hydrus";
    case "12":
      return "Apple";
    default:
      return "Khác";
  }
};

// chuyển key product thành tiếng Việt, vd: color => màu sắc
const convertProductKey = (key) => {
  switch (key) {
    case "brand":
      return "Thương hiệu";

    //điện thoại
    case "resolution":
      return "Màn hình";
    case "displaySize":
      return "Độ phân giải";
    case "operating":
      return "Hệ điều hành";
    case "cpu":
      return "Cpu";
    case "ram":
      return "RAM (GB)";
    case "rom":
      return "Bộ nhớ trong (GB)";
    case "pin":
      return "Dung lượng pin";
    case "before":
      return "Camera trước";
    case "after":
      return "Camera sau";

    //sạc dự phòng
    case "capacity":
      return "Dung lượng";
    case "core":
      return "Lõi pin";
    case "time":
      return "Thời gian sạc";
    case "tech":
      return "Công nghệ sạc";
    case "voltageIn":
      return "Nguồn vào";
    case "voltageOut":
      return "Nguồn ra";
    case "weight":
      return "Khối lượng";

    //headphone
    case "type":
      return "Loại";
    case "connectionStd":
      return "Chuẩn kết nối";
    case "charger":
      return "Cổng sạc";

    case "color":
      return "Màu sắc";
    case "warranty":
      return "Bảo hành";

    default:
      return "Chi tiết khác";
  }
};

// chuyên width màn hình window -> size theo ant design
const convertWidthScreen = (size = 576) => {
  if (size < 576) return "xs";
  if (size >= 576 && size < 768) return "sm";
  if (size >= 768 && size < 992) return "md";
  if (size >= 992 && size < 1200) return "lg";
  if (size >= 1200 && size < 1600) return "xl";
  return "xxl";
};

// Hàm chuyển rate thành text
const convertRateToText = (rate = 0) => {
  switch (rate) {
    case 0:
      return "Sản phẩm quá tệ";
    case 1:
      return "Sản phẩm không tốt";
    case 2:
      return "Sản phẩm bình thường";
    case 3:
      return "Sản phẩm tốt";
    case 4:
      return "Cực kỳ hài lòng";
    default:
      return "Sản phẩm bình thường";
  }
};

// format thời gian
const formatDate = (date = new Date().getTime()) => {
  const d = new Date(date);
  const y = d.getFullYear(),
    m = d.getMonth(),
    day = d.getDate(),
    h = d.getHours(),
    mi = d.getMinutes();

  if (m < 10 && day < 10) return `0${day}-0${m + 1}-${y} ${h}:${mi}`;
  else if (m < 10) return `${day}-0${m + 1}-${y} ${h}:${mi}`;
  else if (day < 10) return `0${day}-${m + 1}-${y} ${h}:${mi}`;
  else return `${day}-${m + 1}-${y} ${h}:${mi}`;
};

const formatOrderDate = (date = new Date().getTime()) => {
  const d = new Date(date);
  const y = d.getFullYear(),
    m = d.getMonth(),
    day = d.getDate();

  if (m < 10 && day < 10) return `0${day}-0${m + 1}-${y} `;
  else if (m < 10) return `${day}-0${m + 1}-${y} `;
  else if (day < 10) return `0${day}-${m + 1}-${y} `;
  else return `${day}-${m + 1}-${y} `;
};

const formatBirthday = (date) => {
  const d = new Date(date);
  const y = d.getFullYear(),
    m = d.getMonth(),
    day = d.getDate();

  if (m < 10 && day < 10) return `0${day}-0${m + 1}-${y} `;
  else if (m < 10) return `${day}-0${m + 1}-${y} `;
  else if (day < 10) return `0${day}-${m + 1}-${y} `;
  else return `${day}-${m + 1}-${y} `;
};

//chuyển loại sản phẩm từ số thành Model
const convertProductType = (type = 0) => {
  switch (type) {
    case 0:
      return "Điện thoại";
    case 1:
      return "Sạc dự phòng";
    case 2:
      return "Tai nghe";

    default:
      return "Khác";
  }
};

// random màu
const randomColor = () => {
  let r = Math.round(Math.random() * 254 + 1);
  let g = Math.round(Math.random() * 254 + 1);
  let b = Math.round(Math.random() * 254 + 1);
  return `rgb(${r},${g},${b})`;
};

// generate autocomplete search options
const autoSearchOptions = () => {
  let result = [];
  FILTER_BRAND_MOBILE.map((item) => {
    return result.push({ value: `Điện thoại ${item.title}` });
  });

  return result;
};

//chuyển nhãn hiệu từ số thành Model
/* const convertProductBrands = (type = 0) => {
  switch (type) {
    case "0":
      return "iPhone";
    case "1":
      return "Samsung";
    case "2":
      return "OPPO";
    case "3":
      return "Realme";
    case "4":
      return "Xiaomi";
    case "5":
      return "Sony";
    case "6":
      return "Vivo";
    case "7":
      return "Ava";
    case "8":
      return "Anker";
    case "9":
      return "Hyper";
    case "10":
      return "Belkin";
    case "11":
      return "Hydrus";
    case "12":
      return "Apple";
    default:
      return "Khác";
  }
}; */

//chuyển nhãn hiệu từ số thành Model
const convertProductColors = (type = 0) => {
  switch (type) {
    case 0:
      return "Bạc";
    case 1:
      return "Đen";
    case 2:
      return "Đỏ";
    case 3:
      return "Tím";
    case 4:
      return "Trắng";
    case 5:
      return "Vàng";
    case 6:
      return "Xanh dương";
    case 7:
      return "Xanh lá";
    case 8:
      return "Xám";
    default:
      return "Khác";
  }
};

// chuyên đổi loại tai nghe
const convertHeadphoneType = (type = 0) => {
  switch (type) {
    case 0:
      return "Bluetooth";
    case 1:
      return "Chụp tai";
    case 2:
      return "Có dây";
    case 3:
      return "Nhét tai";

    default:
      return "Khác";
  }
};

// Chuyển đổi chuẩn kết nối tai nghe
const convertHeadphoneConnectionStd = (std = 0) => {
  switch (std) {
    case 0:
      return "Jack 3.5mm";
    case 1:
      return "Jack USB";
    case 2:
      return "bluetooth 4.1";
    case 3:
      return "bluetooth 4.2";
    case 4:
      return "Bluetooth 5.0";

    default:
      return "Khác";
  }
};

// Chuyển đổi chuẩn kết nối tai nghe
const convertHeadphoneCharger = (charger) => {
  switch (charger) {
    case 0:
      return "Type C";
    case 1:
      return "Micro USB";
    case 2:
      return "Sạc không dây";
    case 3:
      return "Không";

    default:
      return "Không";
  }
};

// Chuyển đổi chuẩn kết nối tai nghe
const convertChargerCapacity = (capacity) => {
  switch (capacity) {
    case 0:
      return "5000 mAh";
    case 1:
      return "7500 mAh";
    case 2:
      return "10000 mAh";
    case 3:
      return "15000 mAh";
    case 4:
      return "20000 mAh";

    default:
      return "Không";
  }
};

// Chuyển đổi chuẩn kết nối tai nghe
const convertChargerCore = (core) => {
  switch (core) {
    case 0:
      return "Li-ion - Nhỏ gọn";
    case 1:
      return "Li-ion LG/Panasonic";
    case 2:
      return "Polymer - Bền bỉ";

    default:
      return "Không";
  }
};

// Chuyển đổi chuẩn kết nối tai nghe
const convertChargerTech = (charger) => {
  switch (charger) {
    case 0:
      return "Sạc không dây";
    case 1:
      return "Sạc nhanh";
    case 2:
      return "Tự điều chỉnh dòng";

    default:
      return "Không";
  }
};

// Chuyển đổi giá trị product từ number sang string
const convertProductValue = (type = 0, product) => {
  if (product === null || product === undefined) return product;
  switch (type) {
    // mobile
    case 0:
      const newColor = convertProductColors(product.color);
      return { ...product, color: newColor };

    //sạc dự phòng
    case 1:
      const newColor1 = convertProductColors(product.color);
      const newCapacity = convertChargerCapacity(product.capacity);
      const newCore = convertChargerCore(product.core);
      const newTech = convertChargerTech(product.tech);
      return {
        ...product,
        capacity: newCapacity,
        core: newCore,
        tech: newTech,
        color: newColor1,
      };

    // headphone
    case 2:
      const newColor2 = convertProductColors(product.color);
      const newCharger = convertHeadphoneCharger(product.charger);
      const newHeadphoneType = convertHeadphoneType(product.type);
      const newHPConnectionStd = convertHeadphoneConnectionStd(
        product.connectionStd
      );
      return {
        ...product,
        type: newHeadphoneType,
        connectionStd: newHPConnectionStd,
        charger: newCharger,
        color: newColor2,
      };

    default:
      return product;
  }
};

// chuyển đổi tình trạng đơn hàng
const convertOrderStatus = (orderStatus = 0) => {
  switch (orderStatus) {
    case 0:
      return "Đang chờ xác nhận";
    case 1:
      return "Đặt hàng thành công";
    case 2:
      return "Đã giao cho ĐVVC";
    case 3:
      return "Đang vận chuyển";
    case 4:
      return "Giao hàng thành công";
    case 5:
      return "Đã hủy";
    default:
      return "Đang chờ xác nhận";
  }
};

// chuyển đổi phương thức thanh toán
const convertPaymentMethod = (payMethod = 0) => {
  switch (payMethod) {
    case 0:
      return "Thanh toán tiền mặt";
    case 1:
      return "Thanh toán online qua VNPAY";
    default:
      return "Thanh toán tiền mặt";
  }
};

// chuyển đổi phương thức thanh toán
const convertTransportMethod = (payMethod = 0) => {
  switch (payMethod) {
    case 0:
      return "Giao hàng nhanh";
    case 1:
      return "Giao hàng tiêu chuẩn";
    case 2:
      return "Giao hàng tiết kiệm";

    default:
      return "Giao hàng nhanh";
  }
};

// tính tổng phí đơn hàng
const calTotalOrderFee = (order) => {
  const { transportFee, total_Money } = order;
  const total = transportFee + total_Money;
  return total;
};

const convertColorSlider = (color) => {
  switch (color) {
    case 0:
      return "silver";
    case 1:
      return "black";
    case 2:
      return "red";
    case 3:
      return "violet";
    case 4:
      return "white";
    case 5:
      return "yellow";
    case 6:
      return "blue";
    case 7:
      return "green";
    case 8:
      return "gray";
    case 9:
      return "orange";
    default:
      return "null";
  }
};

export {
  replaceMongoKeyword,
  formatQueryString,
  queryString,
  analysisQuery,
  addOptionToUrl,
  removeOptionToUrl,
  analysisQueryList,
  convertProductValue,
  reduceProductName,
  formatProductPrice,
  calStar,
  convertProductKey,
  convertWidthScreen,
  convertRateToText,
  convertProductType,
  formatDate,
  randomColor,
  autoSearchOptions,
  formatOrderDate,
  convertOrderStatus,
  convertPaymentMethod,
  convertTransportMethod,
  calTotalOrderFee,
  convertProductColor,
  convertProductBrand,
  convertHeadphoneCharger,
  convertColorSlider,
  formatBirthday,
};
