const Cart = require('../lib/cart')
const LoadProductService = require('../services/LoadProductService')

module.exports = {
   async index(req,res) {
    try {
      const product = await LoadProductService.load('product', { WHERE:  { id: 7 } })

      let { cart } = req.session
      
      cart = Cart.init(cart).addOne(product)

     return res.render('cart/index.njk', { cart })

    } 
    catch (err) {
      console.error(err)
    }
  }
}