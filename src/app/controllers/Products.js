const Category = require('../models/Category')
const Product = require('../models/Product')
const Files = require('../models/Files')
const { unlinkSync } = require('fs')

const { formatPrice, date } = require('../lib/utils')

module.exports = {
  async create(req, res) {
    try {
      const categories = await Category.findAll()
      return res.render('products/create.njk', { categories })
    } catch (err) {
      console.error(err)
    }
  },
  async save(req, res) {
    try {
      // Validação Backend de envio dos dados //É possível fazer essa validação no Frontend antes do envio
      const keys = Object.keys(req.body)

      for (let key of keys) {
        if (req.body[key] == "") {
          return res.send(`Please, fill ${key} field!`)
        }
      }

      if (req.files.length == 0) return res.send('Please, send at least one image!')

      let { category_id, name, description, price, old_price, quantity, status } = req.body

      price = price.replace(/\D/g, "")

      const product_id = await Product.saveCreate({
        category_id,
        name,
        description,
        price,
        old_price: old_price || price,
        quantity,
        status: status || 1,
        user_id: req.session.userID
      })

      const filesPromise = req.files.map(file => Files.saveCreate({ name: file.filename, path: file.path , product_id }))
      await Promise.all(filesPromise)

      return res.redirect(`products/${product_id}`) 

    } catch (err) {
      console.error(err);
    }
  },
  async show(req, res) {
    try {
      const product = await Product.find(req.params.id) 

      if (!product) return res.send("Product not found!")
  
      const { day, hour, minutes, monthExt } = date(product.updated_at)
  
      product.published = {
        day: `${day} de ${monthExt}`,
        hour: `${hour}h${minutes}`
      }
  
      if (product.price < product.old_price) {
        product.oldPrice = formatPrice(product.old_price)
      }
  
      product.old_price = formatPrice(product.old_price)
      product.price = formatPrice(product.price)
  
      let files = await Product.files(product.id)
      files = files.map(file => ({
        name: file.name,
        path: file.path,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }))
  
      return res.render('products/show', { product, files }) 

    } catch (err) {
      console.error(err);
    }
  },
  async edit(req, res) {
    try {
      const product = await Product.find(req.params.id)

      if (!product) return res.send("Product not found!")

      product.price = formatPrice(product.price)

      const categories = await Category.findAll() //retorna um array de rows com todas as categories do DB

      let files = await Product.files(product.id)
      files = files.map(file => ({
        id: file.id,
        name: file.name,
        path: file.path,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }))

      return res.render('products/edit', { product, categories, files })

    } catch (err) {
      console.error(err);
    }
  },
  async update(req, res) {
    try {
      let { id, category_id, name, description, price, old_price, quantity, status } = req.body

      const keys = Object.keys(req.body)
  
      for (let key of keys) {
        if (req.body[key] == "" && key != 'removed_files') {
          return res.send(`Please, fill ${key} field!`)
        }
      }
  
      if (req.files.length != 0) {
        const filesPromise = req.files.map(file => 
          Files.saveCreate({ name: file.filename, path: file.path, product_id: id }))
        await Promise.all(filesPromise)
      }
  

      if (req.body.removed_files) {
        let removedFiles = req.body.removed_files.split(",")
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)
  
        const removedFilesPromise = removedFiles.map(async id => {
          const file = await Files.find(id)
          unlinkSync(file.path)
          Files.delete(id)
        })

        await Promise.all(removedFilesPromise)
      }
  
      price = price.replace(/\D/g, "")
  
      let lastPrice = await Product.find(id)
      lastPrice = lastPrice.price
  
      if (lastPrice != price) {
        old_price = lastPrice
      }
  
      price = price.replace(/\D/g, "")
  
      await Product.saveUpdate(id, {
        category_id,
        name,
        description,
        old_price,
        price,
        quantity,
        status
      })
  
      return res.redirect(`products/${id}`) // redireciona para página edit
    } catch (err) {
      console.error(err);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body

      const files = await Product.files(id)
      
      await Product.delete(id)

      files.map( async file => {
        try {
          unlinkSync(file.path)
        } catch (err) {
          console.error(err);
          
        }
      })

      return res.redirect('/products/create')

    } catch (err) {
      console.error(err);
    }
  }

}

