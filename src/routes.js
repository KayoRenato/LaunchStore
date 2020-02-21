const express = require('express')
const routes = express.Router()

const ProductController = require("./app/controllers/Products")

routes.get('/', (req,res) => {
  res.render('layout.njk')
})

routes.get('/products/create', ProductController.create)
routes.get('/products/:id/edit', ProductController.edit)
routes.post('/products', ProductController.save)
routes.put('/products', ProductController.update)
routes.delete('/products', ProductController.delete)


// Alias
routes.get('/ads/create', (req,res) => {
  res.redirect('/products/create')
})


module.exports = routes
