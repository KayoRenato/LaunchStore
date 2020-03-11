const LoadProductService = require('../services/LoadProductService')
const User = require('../models/User')

const mailer = require("../lib/mailer")

const emailBuy = (seller, buyer, product) => {
  `
  <h2>Olá ${seller.name}</h2>
  <p>Você tem um novo pedido de compra!</p>
  <p>Produto: ${product.name}</p>
  <p>Preço: ${product.formattedPrice}</p>
  <p></br></br></p>
  <h3>Dados do Comprador</h3>
  <p>Nome: ${buyer.name}</p>
  <p>E-mail: ${buyer.email}</p>
  <p>Endereço: ${buyer.address} - ${buyer.cep}</p>
  <p></br></br></p>
  <p><strond>Entre em contato com o comprador para finalizar a venda!</strond></p>
  <p>Atensiosamente, Equipe LaunchStore</p>
  `
}


module.exports = {
  async buy(req,res){
    try {
      // Pegar dados do produto
      const product = await LoadProductService.load('product', { WHERE: { id: req.body.id }})
      // Pegar dados do vendedor
      const seller = await User.findOne({ WHERE: { id: product.user_id}})
      // Pegar dados do comprador
      const buyer = await User.findOne({ WHERE: { id: req.session.userID}})
      // Enviar email com dados da compra para o vendedor
      await mailer.sendMail({
        to:seller.email,
        from:'no-reply@launchstore.com.br',
        subject: 'NO-REPLY: Novo pedido de compra',
        html: emailBuy(seller, buyer, product)
      })
      // notificar o usuário com alguma mensagem de sucesso
      return res.render('orders/sucess')
      
    } catch (err) {
      console.log(err)
      return res.render('orders/error')
    }
  }
}