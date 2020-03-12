const Product = require('../models/Product')

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

module.exports = {
  DouUser,
  DouLogged,
  DouOwner
  
}