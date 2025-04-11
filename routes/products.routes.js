const express = require('express')

const productsController = require('../controllers/products.controller')

const authController = require('../controllers/auth.controller')

const router = express.Router()

router.get('/products', productsController.getAllProducts)

router.get('/products/:id', productsController.getProductDetails);

module.exports = router