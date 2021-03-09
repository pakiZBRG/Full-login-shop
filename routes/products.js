const express = require('express');
const { validProduct } = require('../helpers/Validation');
const { getProducts, createProduct, getSingleProduct, deleteProduct, editProduct } = require('../controllers/products');
const router = express.Router();

router.get("/", getProducts);

router.post('/', validProduct, createProduct);

router.get('/:id', getSingleProduct);

router.post("/:id", deleteProduct);

router.patch('/:id', editProduct);

module.exports = router;