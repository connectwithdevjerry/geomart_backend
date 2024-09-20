const { saveImageToDB } = require("../cloudinaryImageHandler");
const productModel = require("../models/product.model");
// const userModel = require("../models/user.model");

// const user = new userModel({ _id: id });
const isAdmin = true;

const uploadImage = async (req, res) => {
  const result = await saveImageToDB(req.body.image);

  res.send({
    status: true,
    data: result,
  });
};

const createProduct = (req, res) => {
  const product = productModel(req.body);
  product
    .save()
    .then((createdProduct) => {
      // console.log("saved successfully", createdProduct);
      res.send({ status: true, message: "Product Saved Successfully" });
    })
    .catch((err) => {
      console.log({ err });
      res.send({ status: false, message: "Product did not save" });
    });
};

const updateProduct = (req, res) => {
  const filter = { _id: req.params.id };
  const update = req.body;
  const optns = { new: true };
  productModel
    .findOneAndUpdate(filter, update, optns)
    .then((updatedProduct) => {
      console.log("here's the updated Product ", updatedProduct);
      res.send({
        status: true,
        message: "Product successfully updated!",
        data: updatedProduct,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: false, message: "Product was not updated!" });
    });
};

const getProduct = (req, res) => {
  const filter = { _id: req.params.id };
  productModel
    .findOne(filter)
    .then((product) => {
      res.send({ status: true, data: product });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: false, message: "Error getting product!" });
    });
};

const deleteProduct = (req, res) => {
  const filter = { _id: req.params.id };
  productModel
    .deleteOne(filter)
    .then(() => {
      res.send({ status: true, message: "Product sucessfully deleted!" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: false, message: "Could not delete Product!" });
    });
  // console.log(req.body);
};

const searchProduct = async (req, res) => {
  try {
    // Extract search filters from request body or query parameters
    const { searchWord, category, price_range, limit, grade } = req.query;
    let sort = {};

    console.log(req.query);

    // Build the search query object
    const query = {};

    // Add search term to query if provided (searches in 'name' or 'description')
    if (searchWord) {
      query.$or = [
        { productName: { $regex: searchWord, $options: "i" } }, // Case-insensitive search
        { description: { $regex: searchWord, $options: "i" } },
      ];
    }

    // Add category to query if provided
    if (category !== "all_categories") {
      query.category = category;
    }

    // Add price range to query if provided
    if (price_range == "0_50") {
      query.productPrice = { $gte: 0, $lte: 50 };
    } else if (price_range == "50_100") {
      query.productPrice = { $lte: 100 };
    } else if (price_range == "100_200") {
      query.productPrice = { $lte: 200 };
    } else if (price_range == ">200") {
      query.productPrice = { $gt: 200 };
    }

    // Sort the results by price in descending order
    if (grade == "high_to_low") {
      sort = { productPrice: -1 };
    } else if (grade == "low_to_high") {
      sort = { productPrice: 1 };
    } else if (grade == "best_selling") {
      sort = { sales: -1 };
    }

    console.log(query);

    // Fetch products matching the search query
    const products = await productModel
      .find(query)
      .limit(limit)
      .sort(sort)
      .exec();

    console.log({ products });

    // Check if products exist
    if (!products.length) {
      return res.send({
        status: false,
        message: "Product with these criterias not found!",
      });
    }

    // Return products
    return res.send({ status: true, data: products });
  } catch (error) {
    console.error({ error });
    return res.send({
      status: false,
      message: "Server error occurred while searching for products.",
    });
  }
};

const createProducts = (req, res) => {
  // users = [{ productName: "Will Riker" }, { productName: "Geordi LaForge" }];
  if (isAdmin) {
    productModel
      .create(req.body.products)
      .then(() => {
        res.send({
          status: true,
          message: "All products successfully created!",
        });
      })
      .catch(() => {
        res.send({ status: false, message: "Failed to create products!" });
      });
  } else {
    res.send({
      status: false,
      message: "you're not authorized to perform this operation!",
    });
  }
  // console.log(req.body);
};

const updateProducts = (req, res) => {
  const commonFilter = { quantity: 0 };
  const commonUpdate = { $set: { quantity: 9 } };
  if (isAdmin) {
    productModel
      .updateMany(commonFilter, commonUpdate)
      .then((res) => {
        res.send({
          status: true,
          message: "All products successfully updated!",
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: false, message: "Failed to update products!" });
      });
  } else {
    res.send({
      status: false,
      message: "you're not authorized to perform this operation!",
    });
  }
  // console.log(req.body);
};

const getProducts = async (req, res) => {
  if (isAdmin) {
    await productModel
      .find({})
      .then((products) => {
        console.log(products);
        res.send({ status: true, data: products });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: false, message: "Could not get products!" });
      });
  } else {
    res.send({
      status: false,
      message: "you're not authorized to perform this operation!",
    });
  }
};

const deleteProducts = (req, res) => {
  if (isAdmin) {
    productModel
      .deleteMany({})
      .then((res) => {
        res.send({
          status: true,
          message: "All products successfully deleted!",
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: false, message: "Could not get products!" });
      });
  } else {
    res.send({
      status: false,
      message: "you're not authorized to perform this operation!",
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getProduct,
  deleteProduct,
  createProducts,
  updateProducts,
  getProducts,
  deleteProducts,
  uploadImage,
  searchProduct,
};
