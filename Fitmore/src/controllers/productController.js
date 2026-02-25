// // const Product = require('../models/productModel');

// // exports.getProducts = async (req, res) => {
// //   const products = await Product.find();
// //   res.json(products);
// // };

// // exports.getProductById = async (req, res) => {
// //   const product = await Product.findById(req.params.id);
// //   res.json(product);
// // };

// // exports.createProduct = async (req, res) => {
// //   const product = await Product.create(req.body);
// //   res.status(201).json(product);
// // };

// // exports.updateProduct = async (req, res) => {
// //   const product = await Product.findByIdAndUpdate(
// //     req.params.id,
// //     req.body,
// //     { new: true }
// //   );
// //   res.json(product);
// // };

// // exports.deleteProduct = async (req, res) => {
// //   await Product.findByIdAndDelete(req.params.id);
// //   res.json({ message: 'Product deleted' });
// // };


// //new
// const Product = require('../models/productModel');


// // CREATE PRODUCT (admin)
// exports.createProduct = async (req, res) => {
//   try {
//     const product = await Product.create({
//       ...req.body,
//       createdBy: req.user._id
//     });

//     res.status(201).json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // GET ALL PRODUCTS (public)
// exports.getProducts = async (req, res) => {
//   try {
//     const { search, category, sort } = req.query;

//     let query = {};

//     if (search) {
//       query.name = { $regex: search, $options: 'i' };
//     }

//     if (category) {
//       query.category = category;
//     }

//     let products = Product.find(query);

//     if (sort === 'price') {
//       products = products.sort({ price: 1 });
//     }

//     const result = await products;

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // GET SINGLE PRODUCT
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) return res.status(404).json({ message: 'Not found' });

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // UPDATE PRODUCT (admin)
// exports.updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // DELETE PRODUCT (admin)
// exports.deleteProduct = async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Product deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// // ADMIN ADD PRODUCT
// exports.addProduct = async (req, res) => {
//   try {

//     const product = new Product(req.body);

//     await product.save();

//     res.json({
//       success: true,
//       message: "Product Added Successfully"
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // USER GET PRODUCTS
// exports.getProducts = async (req, res) => {

//   const products = await Product.find();

//   res.json(products);
// };
const Product = require('../models/productModel');


// ==========================
// CREATE PRODUCT (ADMIN)
// ==========================
exports.createProduct = async (req, res) => {
  try {

    const product = await Product.create({
      ...req.body,
      createdBy: req.user?._id
    });

    res.status(201).json({
      success: true,
      product
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==========================
// GET ALL PRODUCTS (PUBLIC)
// ==========================
exports.getProducts = async (req, res) => {
  try {

    const { search, category, sort } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    let products = Product.find(query);

    if (sort === 'price') {
      products = products.sort({ price: 1 });
    }

    const result = await products;

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==========================
// GET SINGLE PRODUCT
// ==========================
exports.getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==========================
// UPDATE PRODUCT (ADMIN)
// ==========================
exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==========================
// DELETE PRODUCT (ADMIN)
// ==========================
exports.deleteProduct = async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET SINGLE PRODUCT
exports.getSingleProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};