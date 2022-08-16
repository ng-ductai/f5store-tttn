const productAdminApi = require("express").Router();
const adminController = require("../../controllers/admin/product");

// api: lấy danh sách sản phẩm theo trang và loại
productAdminApi.get("/products", adminController.getProductListByType);

// api: xoá 1 sản phẩm theo id
productAdminApi.delete("/products/remove", adminController.removeProduct);

// api: thêm 1 sản phẩm
productAdminApi.post("/product/add", adminController.addProduct);

// api: lấy 1 sản phẩm theo id
productAdminApi.get("/", adminController.getProduct);

// api: cập nhật 1 sản phẩm
productAdminApi.put("/product/update", adminController.updateProduct);

module.exports = productAdminApi;
