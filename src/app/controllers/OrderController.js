const LoadProductService = require('../services/LoadProductService')
const LoadOrderService = require('../services/LoadOrderService')
const User = require('../models/User')
const Order = require('../models/Order')

const mailer = require("../lib/mailer")
const Cart = require("../lib/cart")
const logo = "https://www.imagemhost.com.br/images/2020/03/12/Screen-Shot-2020-03-11-at-11.55.25-PM.png"

const emailBuy = (seller, buyer, product) => 
  `
  <h3>Olá ${seller.name},</h3>
    <p>Você tem um novo pedido de compra!</p>
    <p>Produto: <i>${product.name}</i></p>
    <p>Preço: <i>${product.formattedPrice}</i></p>
    </br>
  <h3>Dados do Comprador</h3>
    <p>Nome: ${buyer.name}</p>
    <p>E-mail: ${buyer.email}</p>
    <p>Endereço: ${buyer.address} - ${buyer.cep}</p>
    </br>
  <p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
  <p></br></p>
  <p style="text-align:center">Atensiosamente,</p>
  <p style="text-align:center;"> <img src="${logo}" border="0" width="200" height="80"/></p>
 
  `

module.exports = {
  async index(req, res){
    try {
      // pegar todos pedidos do usuário 
      const orders = await LoadOrderService.load('orders', { WHERE: { buyer_id: req.session.userID} })
        
      return res.render("orders/index", { orders })

    } catch (err) {
      console.error(err);
      
    }
  }, 
  async buy(req,res){
    try {
      // Pegar produtos do carrinho

      const cart = Cart.init(req.session.cart)
      const buyer_id = req.session.userID
      const filteredItems = cart.items.filter(item => 
        item.product.user_id != buyer_id
      )

      // Criar pedido
      const OrdersPromise = filteredItems.map(async item => {
        let { product, price: total , quantity } = item
        const { price, id: product_id, user_id: seller_id } = product
        const status = "open"

        const order = await Order.saveCreate({
          seller_id,
          buyer_id,
          product_id,
          price,
          total,
          quantity,
          status


        })
  
        // Pegar dados do produto
        product = await LoadProductService.load('product', { WHERE: { id: product_id }})
        // Pegar dados do vendedor
        const seller = await User.findOne({ WHERE: { id: seller_id}})
        // Pegar dados do comprador
        const buyer = await User.findOne({ WHERE: { id: buyer_id}})
        // Enviar email com dados da compra para o vendedor

        await mailer.sendMail({
          to:seller.email,
          from:'no-reply@launchstore.com.br',
          subject: 'NO-REPLY: Novo pedido de compra',
          html: emailBuy(seller, buyer, product)
        })

        return order

      })

      await Promise.all(OrdersPromise)

      // Clear Cart
      delete req.session.cart
      Cart.init()

      // notificar o usuário com alguma mensagem de sucesso
      return res.render('orders/success.njk')
      
    } catch (err) {
      console.log(err)
      return res.render('orders/error.njk')
    }
  },
  async sales(req,res){
    try {
      // pegar todos vendas do usuário 
      const sales = await LoadOrderService.load('orders', { WHERE: { seller_id: req.session.userID} })
        
      return res.render("orders/sales", { sales })

    } catch (err) {
      console.error(err);
      
    }
  },
  async show(req,res){
    try {
      const order = await LoadOrderService.load('order', {WHERE: {id: req.params.id } })
  
      return res.render('orders/details.njk', { order })
      
    } catch (error) {
      return res.redirect('/orders')
    }
  }
}