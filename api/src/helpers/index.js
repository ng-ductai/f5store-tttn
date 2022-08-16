const VerifyModel = require("../models/account/verify");
const constants = require("../constants/index");
const MobileModel = require("../models/product/specifications/mobile");
const BackupChargerModel = require("../models/product/specifications/backupCharger");
const HeadphoneModel = require("../models/product/specifications/headphone");
const AddressModel = require("../models/address");

// tạo mã xác thực
const generateVerifyCode = (numberOfDigits) => {
  //random một số từ 1 -> 10^numberOfDigits
  const n = parseInt(numberOfDigits);
  const number = Math.floor(Math.random() * Math.pow(10, n)) + 1;
  let numberStr = number.toString();
  const l = numberStr.length;
  for (let i = 0; i < 6 - l; ++i) {
    numberStr = "0" + numberStr;
  }
  return numberStr;
};

// kiểm tra mã xác thực
const isVerifyEmail = async (email, verifyCode) => {
  try {
    const res = await VerifyModel.findOne({ email });
    if (res) {
      const { code, dateCreated } = res;
      if (code !== verifyCode) return false;
      const now = Date.now();
      // kiểm tra mã còn hiệu lực hay không
      if (now - dateCreated > constants.VERIFY_CODE_TIME_MILLISECONDS)
        return false;
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

//chuyển loại sản phẩm từ số thành Model
const convertProductType = (type = 0) => {
  switch (type) {
    case 0:
      return MobileModel;
    case 1:
      return BackupChargerModel;
    case 2:
      return HeadphoneModel;

    default:
      return MobileModel;
  }
};

// xác định loại sản phẩm thông qua string
const typeOfProduct = (str = "") => {
  if (str === undefined || str === "") return [];
  let typeList = [];
  const strLow = str.toLowerCase();
  const list = constants.PRODUCT_TYPES_VN;
  for (let i = 0; i < list.length; ++i) {
    if (strLow.includes(list[i].label.toLowerCase()))
      typeList.push(list[i].type);
  }
  return typeList;
};

// xác định hãng sản phẩm thông qua string
const brandOfProduct = (str = "") => {
  if (str === undefined || str === "") return [];
  let typeList = [];
  const strLow = str.toLowerCase();
  const list = constants.BRANDS_TYPES;
  for (let i = 0; i < list.length; ++i) {
    if (strLow.includes(list[i].label.toLowerCase()))
      typeList.push(list[i].type);
  }
  return typeList;
};

// chuyển object chứa regex dạng string, ex: {$regex: '/^apple$/i'} => {$regex: /^apple$/i}
const convertObjectContainsRegex = (obj) => {
  const newObj = { ...obj };
  if (newObj.hasOwnProperty("$or")) {
    // đa giá trị
    newObj["$or"].forEach((item) => {
      for (let key in item) {
        if (typeof item[key] === "object") {
          for (const k in item[key]) {
            if (
              k === "$regex" &&
              (typeof item[key][k] === "string" ||
                typeof newObj[key][k] === "number")
            ) {
              item[key][k] = new RegExp(item[key][k], "gi");
            }
          }
        }
        if (
          key === "$regex" &&
          (typeof item[key] === "string" || typeof newObj[key][k] === "number")
        ) {
          item[key] = new RegExp(item[key], "gi");
        }
      }
    });
  } else {
    // đơn giá trị
    for (let key in newObj) {
      if (typeof newObj[key] === "object") {
        for (const k in newObj[key]) {
          if (
            k === "$regex" &&
            (typeof newObj[key][k] === "string" ||
              typeof newObj[key][k] === "number")
          ) {
            newObj[key][k] = new RegExp(newObj[key][k], "gi");
          }
        }
      }
      if (
        key === "$regex" &&
        (typeof newObj[key] === "string" || typeof newObj[key][k] === "number")
      ) {
        newObj[key] = new RegExp(newObj[key], "gi");
      }
    }
  }
  return newObj;
};

// chuyển address id thành address string
const convertAddress = async (address) => {
  try {
    let result = "";
    const { province, district, wards, details } = address;
    const data = await AddressModel.findOne({ id: province.toString() });
    if (data) {
      const { districts } = data;
      const proName = data.name;

      const dis = districts.find((item) => {
        return item.id === district.toString();
      });

      if (dis) {
        const disName = dis ? dis.name : "";
        const ward = dis.wards.find((item) => item.id == wards.toString());
        const wName = ward.prefix + " " + ward.name;

        result = details + ", " + wName + ", " + disName + ", " + proName;
      } else {
        return proName;
      }
    }
    return result;
  } catch (error) {
    console.log(error);
    return "";
  }
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

// hàm format giá sản phẩm
const formatProductPrice = (price) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// tính tổng phí đơn hàng
const calTotalOrderFee = (order) => {
  const { transportFee, total_Money } = order;
  const total = transportFee + total_Money;
  return total;
};

module.exports = {
  generateVerifyCode,
  isVerifyEmail,
  convertProductType,
  typeOfProduct,
  convertObjectContainsRegex,
  convertAddress,
  formatOrderDate,
  convertOrderStatus,
  convertPaymentMethod,
  convertTransportMethod,
  formatProductPrice,
  calTotalOrderFee,
  brandOfProduct,
};
