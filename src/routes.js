const express = require('express')
const routes = express.Router()
const instructors = require("./app/controllers/instructors")
const members = require("./app/controllers/members")

routes.get('/', instructors.redirect)

routes.get('/instructors', instructors.table)
routes.get('/instructors/create', instructors.create)
routes.get('/instructors/:id', instructors.show)
routes.get('/instructors/:id/edit', instructors.edit)
routes.post('/instructors', instructors.save)
routes.put('/instructors', instructors.update)
routes.delete('/instructors', instructors.delete)

routes.get('/members', members.table)
routes.get('/members/create', members.create)
routes.get('/members/:id', members.show)
routes.get('/members/:id/edit', members.edit)
routes.post('/members', members.save)
routes.put('/members', members.update)
routes.delete('/members', members.delete)

module.exports = routes
