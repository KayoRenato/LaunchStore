const LoadProductService = require('../services/LoadProductService')

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
  try {
    const product = await LoadProductService.load('product', { WHERE: { user_id: req.session.userID }, AND: { id: req.params.id }})
    next()
  } catch (err) {
    return res.redirect('/users/ads')
    
  }
}

module.exports = {
  DouUser,
  DouLogged,
  DouOwner
  
}