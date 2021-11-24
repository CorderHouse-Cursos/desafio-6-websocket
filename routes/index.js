const { Router } = require('express');
const { getProducts, getProduct, createProduct, deleteProduct, updateProduct } = require('../controllers/products.js');

const routes = Router();





routes.get('/', getProducts)
routes.post('/', createProduct)
routes.get('/:id', getProduct)
routes.put('/:id', updateProduct)
routes.delete('/:id', deleteProduct)


module.exports = routes