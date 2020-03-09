const express = require('express')
const multer = require('../app/middlewares/multer')
const { DouUser } = require('../app/middlewares/session')
const routes = express.Router()

const ProductController = require("../app/controllers/ProductController")
const SearchController = require("../app/controllers/SearchController")

// SEARCH
routes.get('/search', SearchController.index)

// PRODUCTS
routes.get('/create', DouUser, ProductController.create)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', DouUser, ProductController.edit)

// O middleware multer vai verificar o input de name = photo dos forms e irá salvar os arquivos no backend conforme os parametros configurados e além da req.body a rota apresentará tb o req.files
routes.post('/', DouUser, multer.array('photos', 6), ProductController.save)
routes.put('/', DouUser, multer.array('photos', 6), ProductController.update)

routes.delete('/', DouUser, ProductController.delete)

module.exports = routes
