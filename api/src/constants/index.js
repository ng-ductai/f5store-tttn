module.exports = {
  // số lượng của mã xác thực
  NUMBER_VERIFY_CODE: 6,

  // thời gian tồn tại của mã xác thực
  VERIFY_CODE_TIME_MILLISECONDS: 10 * 60 * 1000,

  // số lần đăng nhập sai tối đa
  MAX_FAILED_LOGIN_TIMES: 3,

  // thời gian sống mặc định cho jwt
  JWT_EXPIRES_TIME: 3 * 24 * 3600, //3 days (by sec)

  // thời hạn hiệu lực cho token
  COOKIE_EXPIRES_TIME: 10 * 24 * 3600 * 1000, //10 days

  // thời hạn hiệu lực cho refresh token
  JWT_REFRESH_EXPIRES_TIME: 30 * 24 * 3600, // 1 months

  PRODUCT_TYPES_VN: [
    { type: 0, label: "Điện thoại" },
    { type: 1, label: "Sạc dự phòng" },
    { type: 2, label: "Tai nghe" },
  ],

  //brand options
  BRANDS_TYPES: [
    { type: "0", label: "iPhone" },
    { type: "1", label: "Samsung" },
    { type: "2", label: "OPPO" },
    { type: "3", label: "Realme" },
    { type: "4", label: "Xiaomi" },
    { type: "5", label: "Sony" },
    { type: "6", label: "Vivo" },
    { type: "7", label: "Ava" },
    { type: "8", label: "Anker" },
    { type: "9", label: "Hyper" },
    { type: "12", label: "Apple" },
    { type: "10", label: "Belkin" },
    { type: "11", label: "Hydrus" },
  ],

  // Loại sản phẩm
  PRODUCT_TYPES: {
    MOBILE: 0,
    BACKUP_CHARGER: 1,
    HEADPHONE: 2,
  },
};
