const helpers = require("../helpers");
const ProductDescModel = require("../models/product/description");
const ProductModel = require("../models/product/product");

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

    // Trả về
    return res.status(200).json({ product, productDetail, productDesc });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Không thể lấy dữ liệu" });
  }
};

// api: Lấy danh sách sản phẩm liên quan
const getProductList = async (req, res, next) => {
  try {
    const { type, brand, id } = req.query;
    let query = {};
    if (type !== -1) query = { type };
    if (brand !== -1) query = { $and: [{ ...query }, { brand }] };
    if (id !== "") query = { ...query, _id: { $ne: id } };

    const list = await ProductModel.find(query).limit(8);
    return res.status(200).json({ data: list });
  } catch (error) {
    return res.status(400).json({ message: "Không thể lấy dữ liệu" });
  }
};

// api: Lấy danh sách sản phẩm bán chạy
const getProductListSoldBest = async (req, res, next) => {
  try {
    const list = await ProductModel.aggregate([
      { $sort: { sold: -1, _id: -1 } },
      { $limit: 8 },
    ]);
    return res.status(200).json({ data: list });
  } catch (error) {
    return res.status(400).json({ message: "Không thể lấy dữ liệu" });
  }
};

// api: Lấy tất cả sản phẩm và phân trang
const getAllProducts = async (req, res, next) => {
  try {
    let { page, perPage } = req.query;

    // lấy toàn bộ danh sách cho trang admin
    if (parseInt(page) === -1) {
      const result = await ProductModel.find({});
      return res.status(200).json({ data: result });
    }
    // lấy toàn bộ danh sách cho trang client theo số sp/page
    else {
      const nSkip = (parseInt(page) - 1) * perPage;
      const numOfProduct = await ProductModel.countDocuments({});
      const result = await ProductModel.find({})
        .sort("-createdAt")
        .skip(nSkip)
        .limit(parseInt(perPage))
        .select(" -code");
      return res.status(200).json({ count: numOfProduct, data: result });
    }
  } catch (error) {
    console.error(error);
  }
};

// api: tìm kiếm sản phẩm
const getSearchProducts = async (req, res, next) => {
  try {
    let { value, page, perPage } = req.query;
    const typeList = helpers.typeOfProduct(value);
    const brandList = helpers.brandOfProduct(value);

    const typeQuery = typeList.map((item) => {
      return { type: item };
    });
    console.log("typeQuery", typeQuery);

    const brandQuery = brandList.map((item) => {
      return { brand: item };
    });
    console.log("brandQuery", brandQuery);

    // pagination
    if (!page) page = 1;
    if (!perPage) perPage = 8;
    const nSkip = (parseInt(page) - 1) * perPage;

    // query
    let numOfProduct = 0;
    let result = [];
    let query;
    if (typeQuery.length > 0 && brandQuery.length > 0) {
      query = {
        $and: typeQuery.concat(brandQuery),
      };
    } else if (typeQuery.length > 0 && brandQuery.length === 0) {
      query = {
        $or: typeQuery,
      };
    }
    console.log("query", query);
    
    // lọc theo điều kiện nếu có
    if (value !== "") {
      numOfProduct = await ProductModel.find(query).countDocuments();
      result = await ProductModel.find(query)
        .sort("-createdAt")
        .skip(nSkip)
        .limit(parseInt(perPage))
        .select("-code");
    }

    // return
    if (result) {
      return res.status(200).json({ count: numOfProduct, list: result });
    }
  } catch (error) {
    console.error("Search product error: ", error);
    return res.status(400).json({ count: 0, list: [] });
  }
};

// api: lọc sản phẩm
const getFilterProducts = async (req, res, next) => {
  try {
    // pOption: product query option, dOption: detail query option
    let { type, pOption, dOption, page, perPage } = req.query;
    type = parseInt(type);

    if (type == undefined || !Number.isInteger(type)) type = 0;
    if (pOption == undefined) pOption = "{}";
    if (dOption == undefined) dOption = "{}";

    // convert to object
    let pOptionQuery = helpers.convertObjectContainsRegex(JSON.parse(pOption));
    console.log("pOptionQuery", pOptionQuery);
    const dOptionQuery = helpers.convertObjectContainsRegex(
      JSON.parse(dOption)
    );
    console.log("dOptionQuery", dOptionQuery);

    // pagination
    if (!page) page = 1;
    if (!perPage) perPage = 8;
    const nSkip = (parseInt(page) - 1) * perPage;

    // get model with type
    const Model = helpers.convertProductType(type);
    // populate query
    const joinQuery = {
      path: "idProduct",
      match: pOptionQuery,
      select: " -code",
    };

    console.log("joinQuery", joinQuery);

    // query and populate with product model
    let products = await Model.find(dOptionQuery)
      .populate(joinQuery)
      .select("idProduct -_id")
     

    // giữ lại thuộc tính chung sản phẩm và lọc giá trị null được tạo ra khi populate
    products = products.map((item) => item.idProduct);
    products = products.filter((item) => item !== null);

    // return
    if (products) {
      return res.status(200).json({
        count: products.length,
        list: products.slice(nSkip, parseInt(perPage) + nSkip),
      });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

module.exports = {
  getProduct,
  getProductList,
  getAllProducts,
  getSearchProducts,
  getFilterProducts,
  getProductListSoldBest,
};
