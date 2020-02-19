const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')


const server = express() //criar o servidor 

server.use(express.urlencoded({extended:true}))
server.use(express.static('public')) //utilizar arquivos staticos (style.css)
server.use(methodOverride('_method')) // sobrescrever as rodas com PUT e DELETE
server.use(routes) //disponibilizar as rotas para o servidor

server.set("view engine", "njk")

nunjucks.configure("src/app/views", {
  express: server,
  autoescape: false,
  noCache: true
})

server.listen(5000, () => console.log('server is running'))

