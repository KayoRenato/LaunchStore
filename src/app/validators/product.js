const Category = require('../models/Category')

async function DouFillAllFields(req, res, next){
  const keys = Object.keys(req.body)
  let inputs = true

  for (let key of keys) {
    if (req.body[key] == "") {
      inputs = false
    }
  }

  if (!req.files || req.files.length == 0) {
    inputs = false
  }
      
  if(!inputs) {
    const categories = Category.findAll()
    return res.render('products/create.njk', {
      categories,
      error:'Por favor, prencha todos os campos!'
     
    })
  }

  next()
}

module.exports = {
  DouFillAllFields
}