const Product = require('../models/Product')

const { formatPrice } = require('../lib/utils')

module.exports = {
  async index(req,res) {
    try {
        const products = await Product.all()
    
        if(!products) return res.send('Product not Found!')
    
        async function getImage(ProductID){
          let files = await Product.files(ProductID)
          //criando um array de path das imgs daquele produto
          files = files.map(img => (`${req.protocol}://${req.headers.host}${img.path.replace("public","")}`))
          //retornando apenas o path da img principal
          return files[0]
        }
    
        const productsPromise =  products.map(async product => {
          product.img = await getImage(product.id)
          product.oldPrice = formatPrice(product.old_price)
          product.priceNew = formatPrice(product.price)
          return product
        }).filter((product, index) => index > 2 ? false : true)
    
        lastAdded = await Promise.all(productsPromise)
    
        return res.render('home/index.njk', {products: lastAdded})
    } 
    catch (err) {
      console.error(err)
    }
  }
}