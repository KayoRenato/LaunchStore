const { formatPrice, date } = require('../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')
const Files = require('../models/Files')

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

    if(req.files.length == 0) return res.send('Please, send at least one image!')

    const saveDB = await Product.saveCreate(req.body) //retorna um array de rows com o ID do produto salvo
    const productResID = saveDB.rows[0].id

    const filesPromise = req.files.map(file => Files.saveFiles({...file, product_id: productResID}))
    await Promise.all(filesPromise)

    return res.redirect(`products/${productResID}`) // redireciona para página edit

  },
  async show(req, res){
    let results = Product.find(req.params.id) //retorna um array de rows com o ID informado no req.params
    const product = (await results).rows[0]

    if(!product) return res.send("Product not found!")

    const { day, hour, minutes, month, monthExt } = date(product.updated_at)

    product.published = {
      day: `${day} de ${monthExt}`,
      hour: `${hour}h${minutes}`
    }

    if(product.price < product.old_price){
      product.oldPrice = formatPrice(product.old_price)
    }

    product.old_price = formatPrice(product.old_price)
    product.price = formatPrice(product.price)

    const imageDB = await Product.files(product.id)
    const files = imageDB.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
    }))

  
    return res.render('products/show', { product, files })

  },
  async edit(req,res) {
     
    let results = Product.find(req.params.id) //retorna um array de rows com o ID informado no req.params
    const product = (await results).rows[0]

    if(!product) return res.send("Product not found!")

    // product.old_price = formatPrice(product.old_price)
    product.price = formatPrice(product.price)
  
    const categoriesDB = await Category.all() //retorna um array de rows com todas as categories do DB
    const categories = categoriesDB.rows

    // Pq não criou a método files dentro do Model Files???? Já que a busca vai ser dentro do tabela files?
    const imageDB = await Product.files(product.id)
    let files = imageDB.rows
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
    }))

    return res.render('products/edit', {product, categories, files})

  },
  async update(req,res){
    let { id, price, old_price } = req.body

    const keys = Object.keys(req.body)

    for(let key of keys){
      // req.body[key] - informar o valor da tag input da respectiva key(name)
      if(req.body[key]=="" && key != 'removed_files'){
        return res.send(`Please, fill ${key} field!`)
      }
    }

    if(req.files.length != 0) {
      const filesPromise = req.files.map(file => Files.saveFiles({...file, product_id: id}))
      await Promise.all(filesPromise) 
    }

    if(req.body.removed_files){
      let removedFiles = req.body.removed_files.split(",")
      const lastIndex = removedFiles.length -1
      removedFiles.splice(lastIndex,1)

      const removedFilesPromise = removedFiles.map(id => Files.deleteFile(id))
      await Promise.all(removedFilesPromise)
    }
    
    price = price.replace(/\D/g, "")

    if(old_price != price){
      const oldProduct = await Product.find(id)
      old_price = oldProduct.rows[0].price
    }

    const newProduct = {...req.body, price, old_price}

    await Product.saveUpdate(newProduct) //retorna um array de rows com o ID do produto salvo

    return res.redirect(`products/${id}`) // redireciona para página edit
  },
  async delete(req,res){
    const { id } = req.body

    await Product.delete(id)

    return res.redirect('/products/create')
  }

}

