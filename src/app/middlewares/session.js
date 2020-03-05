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

module.exports = {
  DouUser,
  DouLogged
}