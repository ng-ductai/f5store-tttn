const ProductModel = require("../../models/product/product");
const { cloudinary } = require("../../configs/cloudinary");
const ProductDescModel = require("../../models/product/description");
const MobileModel = require("../../models/product/specifications/mobile");
const BackupChargerModel = require("../../models/product/specifications/backupCharger");
const HeadphoneModel = require("../../models/product/specifications/headphone");
const helpers = require("../../helpers");
const constants = require("../../constants");

// upload product avatar to cloudinary
const uploadProductAvt = async (avtFile, productCode) => {
  try {
    const result = await cloudinary.uploader.upload(avtFile, {
      folder: `products/${productCode}`,
    });
    const { secure_url } = result;
    return secure_url;
  } catch (error) {
    throw error;
  }
};

// upload product catalogs to cloudinary
const uploadProductCatalogs = async (catalogs, productCode) => {
  try {
    const urlCatalogs = [];
    for (let item of catalogs) {
      const result = await cloudinary.uploader.upload(item, {
        folder: `products/${productCode}`,
      });
      urlCatalogs.push(result.secure_url);
    }
    return urlCatalogs;
  } catch (error) {
    throw error;
  }
};

// upload product desc photo to cloudinary
const uploadDescProductPhoto = async (desc, productCode) => {
  try {
    let result = [];
    for (let item of desc) {
      const { content, photo } = item;
      const resUpload = await cloudinary.uploader.upload(photo, {
        folder: `products/${productCode}/desc`,
      });
      result.push({ content, photo: resUpload.secure_url });
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Tạo chi tiết cho một sản phẩm
const createProductDetail = async (type, product) => {
  try {
    switch (type) {
      case constants.PRODUCT_TYPES.MOBILE: {
        const { afterCamera, beforeCamera, ...rest } = product;
        const cameras = { before: beforeCamera, after: afterCamera };
        return await MobileModel.create({ cameras, ...rest });
      }

      case constants.PRODUCT_TYPES.BACKUP_CHARGER:
        return await BackupChargerModel.create({ ...product });

      case constants.PRODUCT_TYPES.HEADPHONE:
        return await HeadphoneModel.create({ ...product });

      default:
        throw new Error("Loại sản phẩm không hợp lệ");
    }
  } catch (error) {
    throw error;
  }
};

// api: Thêm sản phẩm
const addProduct = async (req, res, next) => {
  try {
    const { product, details, desc } = req.body;
    const { type, avatar, code, ...productRest } = product;
    const { warranty, catalogs, ...detailRest } = details;

    // kiểm tra sản phẩm đã tồn tại hay chưa
    const isExist = await ProductModel.exists({ code });
    if (isExist) {
      return res.status(400).json({ message: "Mã sản phẩm đã tồn tại !" });
    }
    // upload product avatar to cloudinary
    const avtUrl = await uploadProductAvt(avatar, code);

    // upload ảnh khác của sản phẩm
    const urlCatalogs = await uploadProductCatalogs(catalogs, code);

    // upload ảnh bài viết mô tả
    let productDesc = desc
      ? await uploadDescProductPhoto(desc.detailDesList, code)
      : null;

    //Tạo sản phẩm mới
    const newProduct = await ProductModel.create({
      type,
      code,
      avt: avtUrl,
      ...productRest,
    });

    // Tạo sp thành công thì tạo chi tiết sản phẩm theo từng loại
    if (newProduct) {
      const { _id } = newProduct;
      // Tạo bài viết mô tả
      const newDesc = productDesc
        ? await ProductDescModel.create({
            idProduct: _id,
            title: desc.title,
            desc: productDesc,
          })
        : null;

      // Tạo chi tiết sản phẩm
      const newProductDetail = await createProductDetail(type, {
        idProduct: _id,
        details: newDesc ? newDesc._id : null,
        warranty,
        catalogs: urlCatalogs,
        ...detailRest,
      });

      if (newProductDetail) {
        return res.status(200).json({ message: "Thêm sản phẩm thành công" });
      }
    }
  } catch (error) {
    return res.status(409).json({ message: "Thử lại" });
  }
};

// api: Lấy 1 sản phẩm theo id
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.query;

    // Lấy tổng quan sản phẩm
    const product = await ProductModel.findById(id);

    // Lấy chi tiết sản phẩm theo loại
    const { _id, type } = product;
    const Model = helpers.convertProductType(type);
    const productDetail = await Model.findOne({
      idProduct: product._id,
    }).select("-_id -idProduct -__v -details");

    // Lấy mô tả sản phẩm
    const productDesc = await ProductDescModel.findOne({
      idProduct: _id,
    }).select("-_id -idProduct -__v");

    return res.status(200).json({ product, productDetail, productDesc });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Không thể lấy dữ liệu" });
  }
};

// api: Lấy danh sách sản phẩm theo loại và trang
const getProductListByType = async (req, res, next) => {
  try {
    const { type, page, perPage } = req.query;
    const nSkip = (parseInt(page) - 1) * perPage;
    const numOfProduct = await ProductModel.countDocuments({ type });
    const result = await ProductModel.find({ type })
      .skip(nSkip)
      .limit(parseInt(perPage));
    return res.status(200).json({ count: numOfProduct, data: result });
  } catch (error) {
    throw error;
  }
};

// api: Xoá một sản phẩm
const removeProduct = async (req, res, next) => {
  try {
    const { id } = req.query;
    const response = await ProductModel.findById(id).select("type");
    if (response) {
      // xoá sản phẩm
      await ProductModel.deleteOne({ _id: id });
      // xoá bài mô tả sản phẩm
      await ProductDescModel.deleteOne({ idProduct: id });
      const { type } = response;
      // xoá chi tiết sản phẩm
      const Model = helpers.convertProductType(type);
      await Model.deleteOne({ idProduct: id });
    }
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(409).json({ message: "Xoá sản phẩm thất bại" });
  }
};

// Chỉnh sửa chi tiết cho một sản phẩm
const updateProductDetail = async (type, product) => {
  try {
    switch (type) {
      case constants.PRODUCT_TYPES.MOBILE: {
        const { idProduct, after, before, ...rest } = product;
        const cameras = { before: before, after: after };
        return await MobileModel.updateOne(
          { idProduct: idProduct },
          {
            $set: { cameras, ...rest },
          }
        );
      }

      case constants.PRODUCT_TYPES.BACKUP_CHARGER: {
        const { idProduct, ...rest } = product;
        return await BackupChargerModel.updateOne(
          { idProduct: idProduct },
          { $set: { ...rest } }
        );
      }

      case constants.PRODUCT_TYPES.HEADPHONE: {
        const { idProduct, ...rest } = product;
        return await HeadphoneModel.updateOne(
          { idProduct: idProduct },
          { $set: { ...rest } }
        );
      }

      default:
        throw new Error("Loại sản phẩm không hợp lệ");
    }
  } catch (error) {
    throw error;
  }
};

// Chỉnh sửa cho một sản phẩm
const updateProduct = async (req, res, next) => {
  try {
    const products = req.body;
    const { product, details } = products;

    console.log("e", product);
    console.log("details", details);

    const { _id, discount, code, type, name, price, brand, stock, avt, sold } =
      product;

    const { ...rest } = details;

    const avtUrl = await uploadProductAvt(avt, code);
    // upload ảnh khác của sản phẩm
    /* const urlCatalogs = await uploadProductCatalogs(catalogs, code); */

    const result = await ProductModel.updateOne(
      { _id: _id },
      {
        $set: { avt: avtUrl, discount, name, price, brand, stock, sold },
        $currentDate: { lastModified: true },
      }
    );

    const respone = updateProductDetail(product.type, {
      idProduct: _id,
      ...rest,
    });

    if (respone) {
      return res.status(200).json({ message: "success" });
    }
  } catch (error) {
    console.error(error);
    return res.status(409).json({ message: "failed" });
  }
};

module.exports = {
  addProduct,
  getProductListByType,
  removeProduct,
  updateProduct,
  getProduct,
};
