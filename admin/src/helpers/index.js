// hàm rút gọn tên sản phẩm
const reduceProductName = (name, length = 64) => {
  let result = name;
  if (name && name.length >= length) {
    result = name.slice(0, length) + " ...";
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
    day = d.getDate();

  if (m < 10 && day < 10) return `0${day}-0${m + 1}-${y}`;
  else if (m < 10) return `${day}-0${m + 1}-${y}`;
  else if (day < 10) return `0${day}-${m + 1}-${y}`;
  else return `${day}-${m + 1}-${y}`;
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

//chuyển loại sản phẩm từ số thành Model
const convertProductBrands = (type = 0) => {
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
};

//chuyển loại sản phẩm từ số thành Model
const convertProductBrand = (type = 0) => {
  switch (type) {
    case 0:
      return "iPhone";
    case 1:
      return "Samsung";
    case 2:
      return "OPPO";
    case 3:
      return "Realme";
    case 4:
      return "Xiaomi";
    case 5:
      return "Sony";
    case 6:
      return "Vivo";
    case 7:
      return "Ava";
    case 8:
      return "Anker";
    case 9:
      return "Hyper";
    case 10:
      return "Belkin";
    case 11:
      return "Hydrus";
    case 12:
      return "Apple";
    default:
      return "Khác";
  }
};

//chuyển loại sản phẩm từ số thành Model
const convertProductBrandi = (type = 0) => {
  switch (type) {
    case 0:
      return "0";
    case 1:
      return "1";
    case 2:
      return "2";
    case 3:
      return "3";
    case 4:
      return "4";
    case 5:
      return "5";
    case 6:
      return "6";
    case 7:
      return "7";
    case 8:
      return "8";
    case 9:
      return "9";
    case 10:
      return "10";
    case 11:
      return "11";
    case 12:
      return "12";
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

const convertColor = (color) => {
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
    case 9:
      return "Cam";
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

// chuyển đổi thời gian now -> dd/mm/yyyy
const formatOrderDate = (date = Date.now(), flag = 0) => {
  const newDate = new Date(date);
  const d = newDate.getDate(),
    m = newDate.getMonth() + 1,
    y = newDate.getFullYear();
  return flag === 0
    ? `${d}/${m}/${y}`
    : `${newDate.getHours()}:${newDate.getMinutes()} ${d}/${m}/${y}`;
};

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

// chuyển đổi tình trạng đơn hàng
const convertOrderStatus = (orderStatus = 0) => {
  switch (orderStatus) {
    case 0:
      return "Đang chờ xác nhận";
    case 1:
      return "Đã xác nhận";
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
      return "Thanh toán tiền mặt khi nhận hàng";
    case 1:
      return "Thanh toán online";
    default:
      return "Thanh toán tiền mặt khi nhận hàng";
  }
};

// tính tổng phí đơn hàng
const calTotalOrderFee = (order) => {
  const { transportFee, total_Money } = order;
  const total = transportFee + total_Money;
  return total;
};

export {
  reduceProductName,
  formatProductPrice,
  calStar,
  convertRateToText,
  convertProductType,
  formatDate,
  randomColor,
  formatOrderDate,
  convertOrderStatus,
  convertPaymentMethod,
  calTotalOrderFee,
  convertHeadphoneType,
  convertHeadphoneConnectionStd,
  convertProductBrands,
  convertTransportMethod,
  convertColor,
  convertProductBrandi,
  convertProductBrand,
};
