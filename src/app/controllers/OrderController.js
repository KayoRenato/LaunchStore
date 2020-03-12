const LoadProductService = require('../services/LoadProductService')
const User = require('../models/User')

const mailer = require("../lib/mailer")
const logo = "https://www.imagemhost.com.br/images/2020/03/12/Screen-Shot-2020-03-11-at-11.55.25-PM.png"

const emailBuy = (seller, buyer, product) => 
  `
  <h3>Olá ${seller.name},</h3>
    <p>Você tem um novo pedido de compra!</p>
    <p>Produto: <i>${product.name}</i></p>
    <p>Preço: <i>${product.formattedPrice}</i></p>
    </br>
  <h3>Dados do Comprador</h3>
    <p>Nome: ${buyer.name}</p>
    <p>E-mail: ${buyer.email}</p>
    <p>Endereço: ${buyer.address} - ${buyer.cep}</p>
    </br>
  <p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
  <p></br></p>
  <p style="text-align:center">Atensiosamente,</p>
  <p style="text-align:center;"> <img src="${logo}" border="0" width="200" height="80"/></p>
 
  `



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
      return res.render('orders/success.njk')
      
    } catch (err) {
      console.log(err)
      return res.render('orders/error.njk')
    }
  }
}