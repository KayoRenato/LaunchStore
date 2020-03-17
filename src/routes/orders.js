const express = require('express')
const routes = express.Router()

const { DouUser } = require("../app/middlewares/session")

const OrdersController = require("../app/controllers/OrderController")

routes.post('/', DouUser, OrdersController.buy)

module.exports = routes
