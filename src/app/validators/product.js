const Category = require('../models/Category')

async function DouFillAllFields(req, res, next){
  const keys = Object.keys(req.body)

  for (let key of keys) {
    if (req.body[key] == "") {
      return res.send("Por favor, preenha todos os campos!")
    }
  }

  if (!req.files || req.files.length == 0) {
    return res.send("Por favor, envie pelo menos uma imagem!")
  }


  next()
}

async function DouFillAllFieldsUpdate(req, res, next){
  const keys = Object.keys(req.body)

  for (let key of keys) {
    if (req.body[key] == "" && key != 'removed_files') {
      return res.send("Por favor, preenha todos os campos!")
    }
  }

  next()
}

module.exports = {
  DouFillAllFields,
  DouFillAllFieldsUpdate
}