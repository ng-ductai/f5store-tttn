const authApi = require("express").Router();
const adminController = require("../../controllers/admin/auth");

// api: passportAuth middleware để config passport
const passportAuth = require("../../middlewares/index");

// api: đăng ký tài khoản admin
authApi.post("/admin/add", adminController.postAddAdmin);

// api: đăng nhập với admin
authApi.post("/login", adminController.postLogin);

// api: authenticated with jwt
authApi.get("/auth", passportAuth.jwtAuthenticationAd, adminController.getAuth);

// api: refresh token
authApi.post("/refresh_token", adminController.postRefreshToken);

// api: get  user
authApi.get("/user", passportAuth.jwtAuthenticationAd, adminController.getUser);

// api: logout
authApi.post("/logout", adminController.postLogout);

// api: lấy danh sách người dùng
authApi.get("/customer", adminController.getCustomerList);

// api: cập nhật 1 admin
authApi.put("/customer/updateAd", adminController.updateAccountAdmin);

// api: cập nhật 1 khách hàng
authApi.put("/customer/updateCus", adminController.updateAccountCustomer);

// api: xoá 1 người dùng
authApi.delete("/customer/del", adminController.delCustomer);

module.exports = authApi;
