const CommentModel = require("../models/comment");
const ProductModel = require("../models/product/product");

// api: Lấy danh sách comment của 1 sản phẩm
const getCommentList = async (req, res, next) => {
  try {
    const { id } = req.query;
    const data = await CommentModel.find({ productId: id }).select(
      "-productId -_id"
    );
    if (data) return res.status(200).json(data);
  } catch (error) {
    return res.status(409).json({ message: error });
  }
};

// api: lấy danh sách comment 1 user
const getCommentUser = async (req, res, next) => {
  try {
    const { accountId, productId } = req.query;
    const list = await CommentModel.find({
      accountId: accountId,
      productId: productId,
    }).select("-_id");
    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    return res.status(401).json({});
  }
};

// api: Thêm 1 comment
const postComment = async (req, res, next) => {
  try {
    const data = req.body;
  
    const { productId, rate } = data;
    // Nếu có rate thì cập nhật lại rate trong product
    if (parseInt(rate) !== -1) {
      const product = await ProductModel.findById(productId);
      if (product) {
        let oldRate = product.rate;
        oldRate[rate]++;
        await ProductModel.updateOne(
          { _id: productId },
          { rate: [...oldRate] }
        );
      }
    }

    const response = await CommentModel.create(data);
    if (response) return res.status(200).send("success");
    return res.status(400).send("failed");
  } catch (error) {
    return res.status(400).send("failed");
  }
};

module.exports = {
  getCommentList,
  postComment,
  getCommentUser,
};
