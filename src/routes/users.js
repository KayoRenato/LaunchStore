const express = require('express')
const routes = express.Router()

const SessionController = require("../app/controllers/SessionController")
const UserController = require("../app/controllers/UserController")
const Validator = require("../app/validators/user")

// LOGIN AND LOGOUT
routes.get('/login', SessionController.forgotForm)
routes.post('/login',SessionController.login)
routes.post('/logout',SessionController.logout)

// PASSWORD
routes.get('/forgot-password', SessionController.forgotForm) //solicitar reset
routes.post('/forgot-password',SessionController.forgot) //form para inserir token enviado por e-mail para reset de senha 
routes.get('/password-reset', SessionController.resetForm) // enviar solicitação (irá validar e se estiver ok enviará e-mail com token)
routes.post('/password-reset',SessionController.reset) //validação do token e reset de senha

// USERS
routes.get('/register', UserController.create)
routes.post('/register', Validator.checkFields ,UserController.save)

routes.get('/', Validator.checkUserID, UserController.show)
routes.get('/', UserController.edit) //poderia ser o mesmo controler do create, já que a view fields.njk foi preparada para ambas situações
routes.put('/', Validator.checkPasswordMatch, UserController.update)
routes.delete('/', UserController.delete)

module.exports = routes
