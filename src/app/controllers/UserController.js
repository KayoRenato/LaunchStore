const { date } = require('../lib/utils')

const User = require('../models/User')

module.exports = {
  show(req,res){
    return res.render('user/index')
  },
  create(req,res){
    return res.render('user/register')
  },
  async save(req,res){

    const userID = await User.saveCreate(req.body)

    req.session.userID = userID

    return res.redirect('/users')

  },
  edit(req,res){

  },
  update(req,res){

  },
  delete(req,res){

  }

}