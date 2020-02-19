const Intl = require('Intl')
const { age, date } = require('../lib/date')

const Instructor = require('../models/instructor')

module.exports = {
  // REDIRECT(GET) - 
  redirect(req, res) {
    return res.redirect("/instructors")
  },
  // TABLE(GET) - Mostrar dados dos instrutores cadastrados
  table(req, res) {

    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 3
    let offset = limit * (page - 1)

    const params = {
      filter,
      limit,
      page,
      offset,
      callback(instructors){
        const pagination = {
          total: Math.ceil(instructors[0].total / limit),
          page,
        }

        return res.render("instructors/index", { instructors, pagination,filter })
      }
    }

    Instructor.paginate(params)
  },
  // CREATE (POST) - Mostrar page de criação do Instrutor
  create(req, res) {
   return res.render("instructors/create")
  },
  // SAVE(POST) - Salvar um novo dado do req.body, vindos do form da rota routes.get('/instructors/create', callback - render page create), no arquivo dataCreate.JS
  save(req, res) { 
    Instructor.save(req.body, function(instructor){
      return res.redirect('/instructors')
    })
  },
  // SHOW(GET) - Mostrar dados com referência no parametros informardo no parametro http (req.params)
  show(req, res) {
    Instructor.find(req.params.id, function(instructor){
      if(!instructor) return res.send("Instructor not found!")
      
      instructor.age = age(instructor.birth)
      instructor.create_at = Intl.DateTimeFormat('pt-BR', {day: 'numeric', month: 'long', year: 'numeric'}).format(instructor.create_at)

      return res.render("instructors/show", {instructor})
    })
  },
  // EDIT(GET) - Mostrar dados com referência no parametros informardo no parametro http (req.params) em uma pagina editável
  edit(req, res) {
    Instructor.find(req.params.id, function(instructor){
      if(!instructor) return res.send("Instructor not found!")
      
      instructor.birth = date(instructor.birth).iso

      return res.render("instructors/edit", {instructor})
    })
  },
  // UPDATE(PUT) - Atualizar os dados 
  update(req, res) {
    Instructor.update(req.body, function(){
      return res.redirect(`/instructors/${req.body.id}`)
    })
  },
  // DELETE(DELETE) - Apagar o dado informado
  delete(req, res) {
    Instructor.delete(req.body.id, function(){
      return res.redirect('/instructors')
    })
  }
}


