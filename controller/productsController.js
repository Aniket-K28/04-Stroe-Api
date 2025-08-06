const Products = require('../models/productsModel');
const asyncWrapper = require('../middleware/asyncWrapper');
const { createCustomError } = require('../middleware/customErr');

// GET all products
const GetAllProducts = asyncWrapper(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    sort,
    page = 1,
    limit = 10,
    fields,
  } = req.query;

  const queryObject = {};

  if (search) {
    queryObject.name = { $regex: search, $options: 'i' };
  }

  if (category) {
    queryObject.category = category;
  }

  if (minPrice || maxPrice) {
    queryObject.price = {};
    if (minPrice) queryObject.price.$gte = Number(minPrice);
    if (maxPrice) queryObject.price.$lte = Number(maxPrice);
  }

  if (minRating) {
    queryObject["ratings.average"] = { $gte: Number(minRating) };
  }

  let query = Products.find(queryObject);

  // Sorting
  if (sort) {
    const sortBy = sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field Selection
  if (fields) {
    const selected = fields.split(',').join(' ');
    query = query.select(selected);
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  query = query.skip(skip).limit(Number(limit));

  const allProducts = await query;
  const total = await Products.countDocuments(queryObject);

  res.status(200).json({
    total,
    page: Number(page),
    count: allProducts.length,
    allProducts,
  });
});

// GET single product
const GetSingleProducts = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const product = await Products.findById(id);

  if (!product) {
    return next(createCustomError(`No product with id: ${id}`, 404));
  }

  res.status(200).json({ product });
});

// UPDATE product
const UpdateProducts = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const product = await Products.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(createCustomError(`No product with id: ${id}`, 404));
  }

  res.status(200).json({ msg: 'Product updated', product });
});

// DELETE product
const DeletedProducts = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const product = await Products.findByIdAndDelete(id);

  if (!product) {
    return next(createCustomError(`No product with id: ${id}`, 404));
  }

  res.status(200).json({ msg: 'Product deleted', product });
});

// Export controllers
module.exports = {
  GetAllProducts,
  GetSingleProducts,
  UpdateProducts,
  DeletedProducts,
};
