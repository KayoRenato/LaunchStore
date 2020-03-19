const express = require('express')
const routes = express.Router()

const { DouUser } = require("../app/middlewares/session")

const OrdersController = require("../app/controllers/OrderController")


routes.get('/', DouUser, OrdersController.index)
routes.post('/', DouUser, OrdersController.buy)
routes.get('/sales', DouUser, OrdersController.sales)
routes.get('/:id', DouUser, OrdersController.show)

module.exports = routes
