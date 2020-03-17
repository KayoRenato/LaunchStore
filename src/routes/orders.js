const express = require('express')
const routes = express.Router()

const { DouUser } = require("../app/middlewares/session")

const OrdersController = require("../app/controllers/OrderController")


routes.get('/', DouUser, OrdersController.index)
routes.post('/', DouUser, OrdersController.buy)
routes.get('/sales', DouUser, OrdersController.sales)

module.exports = routes
