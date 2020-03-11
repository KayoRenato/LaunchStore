const User = require('../models/User')
const Product = require('../models/Product')
const LoadProductService = require('../services/LoadProductService')


const { hash } = require("bcryptjs")
const { unlinkSync } = require('fs')
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
      let { name, email, password, cpf_cnpj, cep, address  } = req.body

      password = await hash( password, 8)
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      const userSaved = await User.saveCreate({
        name,
        email,
        password,
        cpf_cnpj,
        cep,
        address
      })

      req.session.userID = userSaved
      req.session.userName = req.body.name.split(" ")[0]

      return res.render('user/index.njk', {
        user: {...req.body, id:userSaved},
        sucess:"Conta criada com sucesso!"

      })
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
      let { name, email, cpf_cnpj, cep, address } = req.body

      cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
      cep = cep.replace(/\D/g,"")

      req.session.userName = req.body.name.split(" ")[0]

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

      
      return res.render("session/login.njk", {
        session: null,
        sucess: "Conta excluída com sucesso!"
      })

    }catch (err) {
      console.error(err)
      return res.render("user/index.njk", {
        user: req.body,
        error: "Erro ao tentar excluir sua conta. Por favor, tente novamente mais tarde."
      })
    }
  },
  async ads(req,res){
    const products = await LoadProductService.load('productsUser',
      { WHERE: { user_id: req.session.userID } }
    )

    return res.render('user/ads', { products })
  }

}