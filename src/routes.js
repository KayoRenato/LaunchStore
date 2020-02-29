const express = require('express')
const multer = require('./app/middlewares/multer')
const routes = express.Router()

const ProductController = require("./app/controllers/Products")
const HomeController = require("./app/controllers/HomeController")


routes.get('/', HomeController.index)

routes.get('/products/create', ProductController.create)
routes.get('/products/:id', ProductController.show)
routes.get('/products/:id/edit', ProductController.edit)

// O middleware multer vai verificar o input de name = photo dos forms e irá salvar os arquivos no backend conforme os parametros configurados e além da req.body a rota apresentará tb o req.files
routes.post('/products', multer.array('photos', 6), ProductController.save)
routes.put('/products', multer.array('photos', 6), ProductController.update)

routes.delete('/products', ProductController.delete)

// Alias
routes.get('/ads/create', (req,res) => {
  res.redirect('/products/create')
})

module.exports = routes
