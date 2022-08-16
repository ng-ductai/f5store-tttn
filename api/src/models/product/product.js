const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// thông tin chung cho các loại sản phẩm
const productSchema = new Schema(
  {
    // mã sản phẩm
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    //tên sản phẩm
    name: { type: String, required: true, trim: true, default: "" },

    //giá
    price: { type: Number, required: true, default: 0 },

    // 0 - mobile, 1 -backupCharger, 2 - headphone
    type: { type: Number, required: true, default: 0 },

    //nhãn hiệu
    brand: { type: String, required: true, trim: true },

    //avatar
    avt: { type: String, required: true, trim: true },

    // số lượng sản phẩm tồn kho
    stock: { type: Number, required: true, default: 0 },

    // số lượng sản phẩm đã bán
    sold: { type: Number, required: true, default: 0 },

    // mức độ khuyến mãi
    discount: { type: Number, default: 0 },

    // đánh giá 1 - 5 sao, tương ứng với index element từ 0 - 4
    rate: { type: [Number], default: [0, 0, 0, 0, 0] },
  },
  {
    timestamps: true,
  }
);

// text search index
productSchema.index(
  { name: "text", /* brand */ code: "text" },
  { name: "ix_search_text", default_language: "none" }
);

const ProductModel = mongoose.model("product", productSchema, "products");

module.exports = ProductModel;
