const Cart = require('../lib/cart')
const LoadProductService = require('../services/LoadProductService')

module.exports = {
   async index(req,res) {
    try {
      let { cart } = req.session
      
      cart = Cart.init(cart)

     return res.render('cart/index.njk', { cart })

    } 
    catch (err) {
      console.error(err)
    }
  },
  async addOne(req,res) {
    try {
      const { id } = req.params
      let { cart } = req.session

      const product = await LoadProductService.load('product', { WHERE: { id } })

      req.session.cart = await Cart.init(cart).addOne(product)

      return res.redirect('/cart')

    } catch (err) {
      console.error(err);
      
    }
  },
  async removeOne(req,res){
    try {
      const { id } = req.params
      let { cart } = req.session

      if(!cart) return res.redirect('/cart')

      req.session.cart = await Cart.init(cart).removeOne(id)

      return res.redirect('/cart')

    } catch (err) {
      console.error(err);
      
    }
  }
}