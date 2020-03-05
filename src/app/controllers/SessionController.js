module.exports = {
  loginForm(req,res){
    return res.render("session/login.njk")
  },
  login(req,res){
    req.session.userID = req.user.id
    req.session.userName = req.user.name.split(" ")[0]
    return res.redirect('/users')
  },
  logout(req,res){
      req.session.destroy()
      return res.redirect('/')
  },
  forgotForm(req,res){

  },
  forgot(req,res){

  },
  resetForm(req,res){

  },
  reset(req,res){

  }

}