const User = require('../models/User')
const { compare } = require('bcryptjs')

async function checkLogin(req, res, next){
  const { email, password } = req.body

  const user = await User.findOne({WHERE:{email}})

  if(!user) return res.render('session/login.njk',{
    user: req.body,
    error: 'Usuário não encontrado!'
  })

  const passed = await compare(password, user.password)

  if(!passed)
    return res.render("session/login.njk", {
      user: req.body,
      error: "Senha incorreta!"
    })
  
  req.user = user

  next()
}

module.exports = {
  checkLogin
}