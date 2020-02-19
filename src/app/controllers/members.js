const Intl = require('Intl')
const { age, date } = require('../lib/date')

const Member = require('../models/member')

module.exports = {
  // REDIRECT(GET) - 
  redirect(req, res) {
    return res.redirect("/members")
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
      callback(members){
        const pagination = {
          total: Math.ceil(members[0].total / limit),
          page,
        }

        return res.render("members/index", { members, pagination,filter })
      }
    }

    Member.paginate(params)

  },
  // CREATE (POST) - Mostrar page de criação do Instrutor
  create(req, res) {
   return res.render("members/create")
  },
  // SAVE(POST) - Salvar um novo dado do req.body, vindos do form da rota routes.get('/members/create', callback - render page create), no arquivo dataCreate.JS
  save(req, res) {
    Member.save(req.body, function(member){
      return res.redirect('/members')
    })
  },
  // SHOW(GET) - Mostrar dados com referência no parametros informardo no parametro http (req.params)
  show(req, res) {
    Member.find(req.params.id, function(member){
      if(!member) return res.send("Member not found!")
      
      member.age = age(member.birth)
      //member.birth = date(member.birth).birthDay
      member.birth = Intl.DateTimeFormat('pt-BR', {day: 'numeric', month: 'long'}).format(member.birth)
      member.create_at = Intl.DateTimeFormat('pt-BR', {day: 'numeric', month: 'long', year: 'numeric'}).format(member.create_at)

      return res.render("members/show", {member})
    })
  },
  // EDIT(GET) - Mostrar dados com referência no parametros informardo no parametro http (req.params) em uma pagina editável
  edit(req, res) {
    Member.find(req.params.id, function(member){
      if(!member) return res.send("Member not found!")
      
      member.birth = date(member.birth).iso

      return res.render("members/edit", {member})
    })
  },
  // UPDATE(PUT) - Atualizar os dados 
  update(req, res) {
    Member.update(req.body, function(){
      return res.redirect(`/members/${req.body.id}`)
    })
  },
  // DELETE(DELETE) - Apagar o dado informado
  delete(req, res) {
    Member.delete(req.body.id, function(){
      return res.redirect('/members')
    })
  },
}


