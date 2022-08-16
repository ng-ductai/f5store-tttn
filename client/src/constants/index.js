import img1 from "../assets/imgs/iphone.png";
import img2 from "../assets/imgs/tainghe1.png";
import img3 from "../assets/imgs/sacduphong.png";

//slide
const heroSlides = [
  {
    title: "iPhone với những tính năng vượt trội",
    description:
      "Apple luôn biết cách khiến người dùng háo hức mong chờ mỗi khi sắp ra mắt dòng iPhone mới. Điện thoại iPhone 13 Pro Max 128 GB - siêu phẩm được mong chờ nhất ở nửa cuối năm 2021 đến từ Apple.",
    img: img1,
    path: "/search/iphone",
    color: "blue",
  },
  {
    title: "Tai nghe vô cùng độc đáo",
    description:
      "Tai nghe Bluetooth True Wireless Sony WF-C500 được thiết kế nhỏ gọn, bo tròn các góc cạnh để vừa khớp với đôi tai của bạn cho cảm giác dễ chịu khi đeo. Mở rộng vùng không gian âm nhạc với 360 Reality Audio. Thưởng thức chất âm vượt trội nhờ công nghệ DSEE.",
    img: img2,
    path: "/search/headphones",
    color: "orange",
  },
  {
    title: "Sạc dự phòng nhiều mẫu đẹp",
    description:
      "Pin sạc dự phòng Xiaomi Mi Essential thiết kế dạng hình chữ nhật quen thuộc với lớp vỏ chắc chắn và có độ nhám giúp tăng ma sát, chống trơn trượt khi cầm nắm. Tích hợp sạc không dây chuẩn Qi với công suất lên đến 10 W",
    img: img3,
    path: "/search/macbook",
    color: "pink",
  },
];

const policy = [
  {
    name: "Free ship",
    description: "Áp dụng cho đơn hàng trên 2 triệu đồng",
    icon: "shopping-bag",
  },
  {
    name: "VIP customers",
    description: "Ưu đãi hấp dẫn cho khách hàng Vip",
    icon: "gem",
  },
  {
    name: "COD payment",
    description: "Thanh toán tiền mặt khi nhận hàng",
    icon: "credit-card",
  },

  {
    name: "Warranty support",
    description: "Tiết kiệm được nhiều tiền hơn",
    icon: "hand-holding-usd",
  },
];

// gender options
const GENDER_OPTIONS = [
  { value: true, label: "Nam" },
  { value: false, label: "Nữ" },
];

// hình thức giao hàng
const TRANSPORT_METHOD_OPTIONS = [
  {
    value: 0,
    label: "Giao hàng nhanh",
    content: "Nhận hàng sau 2-3 ngày",
    price: 100000,
  },
  {
    value: 1,
    label: "Giao hàng tiêu chuẩn",
    content: "Nhận hàng sau 3-4 ngày",
    price: 50000,
  },
  {
    value: 2,
    label: "Giao hàng tiết kiệm",
    content: "Nhận hàng sau 4-5 ngày",
    price: 30000,
  },
];

// product type options
const PRODUCT_TYPES = [
  { type: 0, label: "Điện thoại" },
  { type: 1, label: "Sạc dự phòng" },
  { type: 2, label: "Tai nghe" },
];

const ROUTES = {
  HOME: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/login/forgot-pw",
  PRODUCT: "/product/:productId",
  NOT_FOUND: "/not-found",
  ADMIN: "/admin",
  ACCOUNT: "/account",
  CART: "/cart",
  SEARCH: "/search",
  FILTER: "/filter?t=0",
  FILTER1: "dienthoai",
  PAYMENT: "/payment",
};

//FILTER
// mobile
const FILTER_BRAND_MOBILE = [
  {
    title: "iPhone",
    to: "0",
  },
  {
    title: "Samsung",
    to: "1",
  },
  {
    title: "OPPO",
    to: "2",
  },
  {
    title: "Realme",
    to: "3",
  },
  {
    title: "Xiaomi",
    to: "4",
  },
  {
    title: "Sony",
    to: "5",
  },
  {
    title: "Vivo",
    to: "6",
  },
];

const FILTER_PRICE_MOBILE = [
  {
    title: "Dưới 5 triệu",
    to: "nhohon-5tr",
  },
  {
    title: "Từ 5 - 10 triệu",
    to: "lonhon-5tr,nhohon-10tr",
  },
  {
    title: "Từ 10 - 15 triệu",
    to: "lonhon-10tr,nhohon-15tr",
  },
  {
    title: "Từ 15 - 20 triệu",
    to: "lonhon-15tr,nhohon-20tr",
  },
  {
    title: "Trên 20 triệu",
    to: "lonhon-20tr",
  },
];

const FILTER_ROM_MOBILE = [
  {
    title: "16 GB",
    to: "16GB",
  },
  {
    title: "32 GB",
    to: "32GB",
  },
  {
    title: "64 GB",
    to: "64GB",
  },
  {
    title: "128 GB",
    to: "128GB",
  },
  {
    title: "256 GB",
    to: "256GB",
  },
  {
    title: "512 GB",
    to: "512GB",
  },
];

const FILTER_RAM_MOBILE = [
  {
    title: "4 GB",
    to: "4GB",
  },
  {
    title: "6 GB",
    to: "6GB",
  },
  {
    title: "8 GB",
    to: "8GB",
  },
  {
    title: "12 GB",
    to: "12GB",
  },
  {
    title: "16 GB",
    to: "16GB",
  },
];

//sạc dự phòng
const FILTER_BRAND_CHARGER = [
  {
    title: "Samsung",
    to: "1",
  },
  {
    title: "OPPO",
    to: "2",
  },
  {
    title: "Xiaomi",
    to: "4",
  },
  {
    title: "Sony",
    to: "5",
  },
  {
    title: "Ava",
    to: "7",
  },
  {
    title: "Anker",
    to: "8",
  },
  {
    title: "Hyper",
    to: "9",
  },
];

const FILTER_PRICE_CHARGER = [
  {
    title: "Dưới 300.000đ",
    to: "nhohon-300k",
  },
  {
    title: "Từ 300.000 đến 500.00đ",
    to: "lonhon-300k,nhohon-500k",
  },
  {
    title: "Từ 500.000 đến 800.00đ",
    to: "lonhon-500k,nhohon-800k",
  },
  {
    title: "Trên 1.000.000đ",
    to: "lonhon-1tr",
  },
];

const FILTER_CAPACITY_CHARGER = [
  {
    title: "5000 mAh",
    to: "0",
  },
  {
    title: "7500 mAh",
    to: "1",
  },
  {
    title: "10000 mAh",
    to: "2",
  },
  {
    title: "15000 mAh",
    to: "3",
  },
  {
    title: "20000 mAh",
    to: "4",
  },
];

const FILTER_CORE_CHARGER = [
  {
    title: "Li-ion - Nhỏ gọn",
    to: "0",
  },
  {
    title: "Li-ion LG/Panasonic",
    to: "1",
  },
  {
    title: "Polymer - Bền bỉ",
    to: "2",
  },
];

const FILTER_TECH_CHARGER = [
  {
    title: "Sạc không dây",
    to: "0",
  },
  {
    title: "Sạc nhanh",
    to: "1",
  },
  {
    title: "Tự điều chỉnh dòng",
    to: "2",
  },
];

//headphone
const FILTER_BRAND_HEADPHONE = [
  {
    title: "Samsung",
    to: "1",
  },
  {
    title: "OPPO",
    to: "2",
  },
  {
    title: "Xiaomi",
    to: "4",
  },
  {
    title: "Sony",
    to: "5",
  },
  {
    title: "Ava",
    to: "7",
  },
  {
    title: "Anker",
    to: "8",
  },
  {
    title: "Belkin",
    to: "10",
  },
  {
    title: "Hydrus",
    to: "11",
  },
  {
    title: "Apple",
    to: "12",
  },
];

const FILTER_PRICE_HEADPHONE = [
  {
    title: "Dưới 500.000đ",
    to: "nhohon-500k",
  },
  {
    title: "Từ 500.000 đến 1.000.00đ",
    to: "lonhon-500k,nhohon-1tr",
  },
  {
    title: "Từ 1.000.000 đến 2.000.00đ",
    to: "lonhon-1tr,nhohon-2tr",
  },
  {
    title: "Trên 2.000.000đ",
    to: "lonhon-2tr",
  },
];

const FILTER_TYPE_HEADPHONE = [
  {
    title: "Bluetooth",
    to: "0",
  },
  {
    title: "Chụp tai",
    to: "1",
  },
  {
    title: "Có dây",
    to: "2",
  },
  {
    title: "Nhét tai",
    to: "3",
  },
];

const FILTER_CONNECT_STD_HEADPHONE = [
  {
    title: "Jack 3.5mm",
    to: "0",
  },
  {
    title: "Jack USB",
    to: "1",
  },
  {
    title: "Bluetooth 4.1",
    to: "2",
  },
  {
    title: "Bluetooth 4.2",
    to: "3",
  },
  {
    title: "Bluetooth 5.0",
    to: "4",
  },
];

const FILTER_PORT_HEADPHONE = [
  {
    title: "Type C",
    to: "0",
  },
  {
    title: "Micro USB",
    to: "1",
  },
  {
    title: "Sạc không dây",
    to: "2",
  },
  {
    title: "Không",
    to: "3",
  },
];

// filter options list
const FILTER_OPTION_LIST = [
  // 0: MOBILE
  {
    key: 0,
    root: `${ROUTES.FILTER}?t=0`,
    data: [
      {
        title: "Hãng",
        subFilters: FILTER_BRAND_MOBILE,
        query: "p-reg-thuong_hieu=",
      },
      {
        title: "Dung lượng RAM",
        subFilters: FILTER_RAM_MOBILE,
        query: "ram=",
      },
      {
        title: "Bộ nhớ trong",
        subFilters: FILTER_ROM_MOBILE,
        query: "rom=",
      },
      {
        title: "Theo giá",
        subFilters: FILTER_PRICE_MOBILE,
        query: "p-o-gia=",
      },
    ],
  },

  // 1: BACKUPCHARGER
  {
    key: 1,
    root: `${ROUTES.FILTER}?t=1`,
    data: [
      {
        title: "Hãng",
        subFilters: FILTER_BRAND_CHARGER,
        query: "p-reg-thuong_hieu=",
      },
      {
        title: "Công nghệ sạc",
        subFilters: FILTER_TECH_CHARGER,
        query: "tech=",
      },
      {
        title: "Lõi pin",
        subFilters: FILTER_CORE_CHARGER,
        query: "core=",
      },
      {
        title: "Dung lượng",
        subFilters: FILTER_CAPACITY_CHARGER,
        query: "dungluong=",
      },
      {
        title: "Theo giá",
        subFilters: FILTER_PRICE_CHARGER,
        query: "p-o-gia=",
      },
    ],
  },

  // 2: HEADPHONE
  {
    key: 2,
    root: `${ROUTES.FILTER}?t=2`,
    data: [
      {
        title: "Hãng",
        subFilters: FILTER_BRAND_HEADPHONE,
        query: "p-reg-thuong_hieu=",
      },
      {
        title: "Loại tai nghe",
        subFilters: FILTER_TYPE_HEADPHONE,
        query: "loai=",
      },
      {
        title: "Chuẩn kết nối",
        subFilters: FILTER_CONNECT_STD_HEADPHONE,
        query: "std_connect=",
      },
      {
        title: "Cổng sạc",
        subFilters: FILTER_PORT_HEADPHONE,
        query: "charger_port=",
      },
      {
        title: "Theo giá",
        subFilters: FILTER_PRICE_HEADPHONE,
        query: "p-o-gia=",
      },
    ],
  },
];

// các cặp chuyển đổi url
const PAIR_CONVERT_KEY = [
  { l: `lonhon-`, r: `"$gte":` },
  { l: `nhohon-`, r: `"$lt":` },
  { l: `thuong_hieu`, r: `brand` },
  { l: `gia`, r: `price` },
  { l: `tr`, r: `000000` },
  { l: `k`, r: `000` },

  //điện thoại
  { l: `GB`, r: "" },

  //pin dự phòng
  { l: `core`, r: `core` },
  { l: `tech`, r: `tech` },
  { l: `dungluong`, r: `capacity` },

  //tai nghe
  { l: `loai`, r: `type` },
  { l: `std_connect`, r: `connectionStd` },
  { l: `charger_port`, r: `charger` },
];

const REFRESH_TOKEN = "refresh_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_KEY = "accessToken";
const MAX_VERIFY_CODE = 6;
const CARTS = "carts";
// tuổi nhỏ nhất
const MIN_AGE = 8;
// thời gian delay khi chuyển trang
const DELAY_TIME = 800;
// số lần đăng nhập sai tối đa
const MAX_FAILED_LOGIN_TIMES = 5;
// tỉ lệ nén ảnh, và nén png 2MB
const COMPRESSION_RADIO = 0.6;
const COMPRESSION_RADIO_PNG = 2000000;
// số lượng sản phẩm liên quan tối đa cần lấy
const MAX_RELATED_PRODUCTS = 8;
// Avatar mặc định của user
const DEFAULT_USER_AVT =
  "https://res.cloudinary.com/ductai2982/image/upload/v1655193025/users/slider/default-avt_loae7k.png";
// Số comment sản phẩm trên trang
const COMMENT_PER_PAGE = 5;
// độ dài tối đa của cmt
const MAX_LEN_COMMENT = 1000;

export {
  heroSlides,
  policy,
  REFRESH_TOKEN_KEY,
  ACCESS_TOKEN_KEY,
  MAX_VERIFY_CODE,
  TRANSPORT_METHOD_OPTIONS,
  GENDER_OPTIONS,
  MIN_AGE,
  DELAY_TIME,
  MAX_FAILED_LOGIN_TIMES,
  ROUTES,
  REFRESH_TOKEN,
  PRODUCT_TYPES,
  COMPRESSION_RADIO,
  COMPRESSION_RADIO_PNG,
  MAX_RELATED_PRODUCTS,
  DEFAULT_USER_AVT,
  COMMENT_PER_PAGE,
  MAX_LEN_COMMENT,
  CARTS,
  FILTER_BRAND_MOBILE,
  FILTER_PRICE_MOBILE,
  FILTER_ROM_MOBILE,
  FILTER_RAM_MOBILE,
  FILTER_TYPE_HEADPHONE,
  FILTER_CONNECT_STD_HEADPHONE,
  FILTER_OPTION_LIST,
  PAIR_CONVERT_KEY,
};
