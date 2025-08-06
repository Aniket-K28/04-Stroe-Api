const express = require('express');
const storeRoute = express.Router();

const {
  GetAllProducts,
  GetSingleProducts,
  UpdateProducts,
  DeletedProducts,
} = require('../controller/productsController');

// Define the GET route
storeRoute.get('/', GetAllProducts);
storeRoute.get('/:id',GetSingleProducts);
storeRoute.patch('/:id',UpdateProducts);
storeRoute.delete('/:id',DeletedProducts);
module.exports = storeRoute;
