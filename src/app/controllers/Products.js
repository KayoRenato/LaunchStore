const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports = {
  create(req, res) {
    // Pegar CATEGORIES para mostrar as opções no Frontend
    Category.all().then( results => {
      return res.render('products/create.njk',{ categories:results.rows })
    }).catch( err => {
      throw new Error(err)
    })
  },
  async save(req, res) {

    // Validação Backend de envio dos dados //É possível fazer essa validação no Frontend antes do envio
    const keys = Object.keys(req.body)

    for(let key of keys){
      if(req.body[key]==""){
        return res.send(`Please, fill ${key} field!`)
      }
    }

    const saveDB = await Product.saveCreate(req.body) //retorna um array de rows com o ID do produto salvo
    const productResID = saveDB.rows[0].id

    const categoriesDB = await Category.all() //retorna um array de rows com todas as categories do DB
    const categoriesRes = categoriesDB.rows

    return res.render('products/create', {product: productResID, categories: categoriesRes}) // renderiza página create com as informações salvas no DB

  }

}