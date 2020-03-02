const { date } = require('../lib/utils')

const User = require('../models/User')

module.exports = {
  show(req,res){

  },
  create(req,res){
    return res.render('user/register')
  },
  async save(req,res){
    return res.send('user registred!')
    

  },
  edit(req,res){

  },
  update(req,res){

  },
  delete(req,res){

  }

}