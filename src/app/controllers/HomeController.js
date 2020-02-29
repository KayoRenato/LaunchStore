const { formatPrice } = require('../lib/utils')

const Product = require('../models/Product')
const Files = require('../models/Files')

module.exports = {
  async index(req,res) {
    let result = await Product.all()

    const products = result.rows

    if(!products) return res.send('Product not Found!')

    async function getImage(ProductID){
      let result = await Product.files(ProductID)
      //criando um array de path das imgs daquele produto
      const imgPaths = result.rows.map(img => (`${req.protocol}://${req.headers.host}${img.path.replace("public","")}`))

      //retornando apenas o path da img principal
      return imgPaths[0]
    }

     const productsPromise =  products.map(async product => {
      product.img = await getImage(product.id)
      product.oldPrice = formatPrice(product.old_price)
      product.priceNew = formatPrice(product.price)

      return product
    }).filter((product, index) => index > 2 ? false : true)

    lastAdded = await Promise.all(productsPromise)

    res.render('home/index.njk', {products: lastAdded})
  }

}