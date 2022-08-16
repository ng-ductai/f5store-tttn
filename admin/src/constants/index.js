const ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/login/forgot-pw",
  DASHBOARD: "/dashboard",
  ADMIN: "/admin/all",
  ADMIN_ADD: "/admin/add",
  PRODUCTS: "/products",
  PRODUCT_ADD: "/product/add",
  PRODUCT_EDIT: "/product/:productId",
  CUSTOMERS: "/customers",
  ORDERS: "/orders",
  SLIDERS: "/sliders/all",
  SLIDERS_ADD: "/sliders/add",
  NOT_FOUND: "*",
};

// product type options
const PRODUCT_TYPES = [
  { type: 0, label: "Điện thoại" },
  { type: 1, label: "Sạc dự phòng" },
  { type: 2, label: "Tai nghe" },
];

// gender options
const GENDER_OPTIONS = [
  { value: true, label: "Nam" },
  { value: false, label: "Nữ" },
];

// gender options
const ACTIVE_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "No active" },
];

//color options
const COLOR_CODE = [
  { type: 0, label: "Bạc" },
  { type: 1, label: "Đen" },
  { type: 2, label: "Đỏ" },
  { type: 3, label: "Tím" },
  { type: 4, label: "Trắng" },
  { type: 5, label: "Vàng" },
  { type: 6, label: "Xanh dương" },
  { type: 7, label: "Xanh lá" },
  { type: 8, label: "Xám" },
];

const COLORSLIDER_OPTIONS = [
  { value: 0, label: "Bạc" },
  { value: 1, label: "Đen" },
  { value: 2, label: "Đỏ" },
  { value: 3, label: "Tím" },
  { value: 4, label: "Trắng" },
  { value: 5, label: "Vàng" },
  { value: 6, label: "Xanh dương" },
  { value: 7, label: "Xanh lá" },
  { value: 8, label: "Xám" },
  { value: 9, label: "Cam" },
];

//brand options
const BRANDS_TYPES = [
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
];

// headphone options
const HEADPHONE_TYPES = [
  { type: 0, label: "Bluetooth" },
  { type: 1, label: "Chụp tai" },
  { type: 2, label: "Có dây" },
  { type: 3, label: "Nhét tai" },
];

const CONNECTION_STD = [
  { type: 0, label: "Jack 3.5mm" },
  { type: 1, label: "Jack USB" },
  { type: 2, label: "Bluetooth 4.1" },
  { type: 3, label: "Bluetooth 4.2" },
  { type: 4, label: "Bluetooth 5.0" },
];

const CHARGER_TYPE = [
  { type: 0, label: "Type C" },
  { type: 1, label: "Micro USB" },
  { type: 2, label: "Sạc không dây" },
  { type: 3, label: "Không" },
];

//backup charger options
const CHARGER_CAPACITY = [
  { type: 0, label: "5000 mAh" },
  { type: 1, label: "7500 mAh" },
  { type: 2, label: "10000 mAh" },
  { type: 3, label: "15000 mAh" },
  { type: 4, label: "20000 mAh" },
];

const CHARGER_CORE = [
  { type: 0, label: "Li-ion - Nhỏ gọn" },
  { type: 1, label: "Li-ion LG/Panasonic" },
  { type: 2, label: "Polymer - Bền bỉ" },
];

const CHARGER_TECH = [
  { type: 0, label: "Sạc không dây" },
  { type: 1, label: "Sạc nhanh" },
  { type: 2, label: "Tự điều chỉnh dòng" },
];

// hình thức giao hàng
const TRANSPORT_METHOD_OPTIONS = [
  { value: 0, label: "Giao hàng tiêu chuẩn", price: 40000 },
  { value: 1, label: "Giao hàng tiết kiệm", price: 30000 },
  { value: 2, label: "Giao hàng nhanh", price: 60000 },
];

const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_KEY = "access_token";
const MAX_VERIFY_CODE = 6;
// tuổi nhỏ nhất sử dụng app
const MIN_AGE = 8;
// thời gian delay khi chuyển trang
const DELAY_TIME = 700;
// số lần đăng nhập sai tối đa
const MAX_FAILED_LOGIN_TIMES = 5;
const REFRESH_TOKEN = "refresh_token";
// tỉ lệ nén ảnh, và nén png 2MB
const COMPRESSION_RADIO = 0.6;
const COMPRESSION_RADIO_PNG = 2000000;
// số lượng sản phẩm liên quan tối đa cần lấy
const MAX_RELATED_PRODUCTS = 12;
// Avatar mặc định của user
const DEFAULT_USER_AVT =
  "https://res.cloudinary.com/ductai2982/image/upload/v1655193025/users/slider/default-avt_loae7k.png";

export {
  REFRESH_TOKEN_KEY,
  ACCESS_TOKEN_KEY,
  MAX_VERIFY_CODE,
  MIN_AGE,
  DELAY_TIME,
  MAX_FAILED_LOGIN_TIMES,
  REFRESH_TOKEN,
  COMPRESSION_RADIO,
  COMPRESSION_RADIO_PNG,
  DEFAULT_USER_AVT,
  MAX_RELATED_PRODUCTS,
  TRANSPORT_METHOD_OPTIONS,
  GENDER_OPTIONS,
  ACTIVE_OPTIONS,
  COLOR_CODE,
  ROUTES,
  PRODUCT_TYPES,
  BRANDS_TYPES,
  HEADPHONE_TYPES,
  CONNECTION_STD,
  CHARGER_TYPE,
  CHARGER_CAPACITY,
  CHARGER_CORE,
  CHARGER_TECH,
  COLORSLIDER_OPTIONS,
};
