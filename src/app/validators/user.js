const User = require('../models/User')

async function checkFields(req, res, next){
  let { email, cpf_cnpj, password, passwordCheck  } = req.body
  
  // check if has all fields
  const keys = Object.keys(req.body)
  for(let key of keys){
    if(req.body[key]==""){
      return res.send(`Please, fill ${key} field!`)
    }
  }
  
  // check if user exists [email, cpf_cnpj]
  cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
  const user = await User.findOne({
    WHERE: {email},
    OR: {cpf_cnpj}
  })

  if(user) return res.send('User Exists!')

  // check if password and passwordCheck match
  if(password!=passwordCheck) return res.send('Password Mismatch!')

  next()
}

module.exports = {
  checkFields
}