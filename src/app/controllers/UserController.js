const { hash } = require("bcryptjs")
const { unlinkSync } = require('fs')

const User = require('../models/User')
const Product = require('../models/Product')

const { formatCpfCnpj, formatCep } = require('../lib/utils')

module.exports = {
  async show(req,res){
    try {
      const { user } = req // veio do checkUserID
      user.cpf_cnpj =  formatCpfCnpj(user.cpf_cnpj)
      user.cep =  formatCep(user.cep)

      return res.render('user/index.njk', { user })
    } catch (err) {
      console.error(err);
    }
    
  },
  create(req,res){ 
    return res.render('user/register')
  },
  async save(req,res){
    try {
      let { password, cpf_cnpj, cep  } = req.body

      password = await hash( password, 8)
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      const userID = await User.saveCreate({
        ...req.body,
        password,
        cpf_cnpj,
        cep
      })

      req.session.userID = userID
      req.session.userName = req.body.name.split(" ")[0]

      return res.render('user/index')
    } catch (err) {
      console.error(err);
    }
  },
  edit(req,res){
    return res.render('user/register')
  },
  async update(req,res){
    try {
      let { user } = req
      let { cpf_cnpj, cep } = req.body

      cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
      cep = cep.replace(/\D/g,"")

      req.session.userName = req.body.name.split(" ")[0]

      const userSaved = await User.saveUpdate(user.id, {
        ...req.body,
        cpf_cnpj,
        cep,
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
      const { userID: id } = req.session
      let products = await Product.findAll({ WHERE: { user_id: id  } })

      let filesArray = await products.map(product => Product.files(product.id))
      filesArray = await Promise.all(filesArray)

      await User.delete(id)
      req.session.destroy()

      filesArray.map(fileArray => {
        fileArray.map(file => {
          try {
            unlinkSync(file.path)
          } catch (err) {
            console.error(err)
          }
         })
       }
      )

      res.render("session/login.njk", {
        sucess: "Conta excluída com sucesso!"
      })

    }catch (err) {
      console.error(err)
      return res.render("user/index.njk", {
        user: req.body,
        error: "Erro ao tentar excluir sua conta. Por favor, tente novamente mais tarde."
      })
    }
  }

}