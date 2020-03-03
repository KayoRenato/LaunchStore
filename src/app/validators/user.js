const User = require('../models/User')

async function checkFields(req, res, next){
  let { email, cpf_cnpj, password, passwordCheck  } = req.body
  
  // check if has all fields
  const keys = Object.keys(req.body)
  // Teoricamente nunca chegará nessa validação do backend, pq todos os campos input estão 'REQUERID' no frontend
  for(let key of keys){
    if(req.body[key]==""){
      return res.render('user/register.njk',{
        user: req.body,
        error: 'Por favor, preencha todos os campos!'
      })
    }
  }
  
  // check if user exists [email, cpf_cnpj]
  cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
  const user = await User.findOne({
    WHERE: {email},
    OR: {cpf_cnpj}
  })

  if(user) return res.render('user/register.njk',{
        user: req.body,
        error: 'Usuário já cadastrado!'
  })

  // check if password and passwordCheck match
  if(password!=passwordCheck) return res.render('user/register.njk',{
        user: req.body,
        error: 'Senhas diferentes!'
  })

  next()
}

module.exports = {
  checkFields
}