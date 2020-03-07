const { formatCpfCnpj, formatCep } = require('../lib/utils')

const User = require('../models/User')

module.exports = {
  async show(req,res){
    const { user } = req // veio do checkUserID

    user.cpf_cnpj =  formatCpfCnpj(user.cpf_cnpj)
    user.cep =  formatCep(user.cep)

    return res.render('user/index.njk', { user })
  },
  create(req,res){ //registerForm

    return res.render('user/register')
  },
  async save(req,res){

    const userID = await User.saveCreate(req.body)

    req.session.userID = userID

    return res.redirect('/users')

  },
  edit(req,res){
    return res.render('user/register')
  },
  async update(req,res){
    try {
      let { user } = req
      let { name, email, cpf_cnpj, cep, address } = req.body

      cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
      cep = cep.replace(/\D/g,"")

      const userSaved = await User.saveUpdate(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address
      })

      return res.render("user/index.njk", {
        user: userSaved,
        sucess:"Conta atualizada com sucesso!"
      })

    } catch (err) {
      console.error(err)
      return res.render('user/index.njk', {
        error: "Estamos com algum problema. Tente novamente mais tarde."
      })
    }
  },
  async delete(req,res){
    try {
      
      await User.delete(req.session.userID)
      req.session.destroy()

      res.render("session/login.njk", {
        sucess: "Conta excluída com sucesso!"
      })
    } 
    catch (err) {
      console.error(err)
      return res.render("user/index.njk", {
        user: req.body,
        error: "Erro ao tentar excluir sua conta. Por favor, tente novamente mais tarde."
      })
    }
  }

}