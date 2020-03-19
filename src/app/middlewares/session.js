const Product = require('../models/Product')
const Order = require('../models/Order')

function DouUser(req, res, next){
  if(!req.session.userID)
    return res.redirect('/users/login')
  
  next()
}

function DouLogged(req, res, next){
  if(req.session.userID)
   return res.redirect('/users')

   next()
}

async function DouOwner(req, res, next){
  const product = await Product.findOne({ WHERE: { user_id: req.session.userID }, AND: { id: req.params.id }})
  if(!product) 
    return res.redirect('/users/ads')

  next()

}

async function DouSeller(req, res, next){
  const order = await Order.findOne({ WHERE: { seller_id: req.session.userID }, AND: { id: req.params.id }})
  if(!order) 
    return res.redirect('/orders/sales')

  next()

}



module.exports = {
  DouUser,
  DouLogged,
  DouOwner,
  DouSeller
  
}