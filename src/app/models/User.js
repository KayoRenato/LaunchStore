const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs = require('fs')

const ProductsModel = require("../models/Product")

module.exports ={

  async findOne(filters){

    try {
      let query = "SELECT * FROM users"

      Object.keys(filters).map(key => {
        // WHERE || OR || AND

        query = `${query}
        ${key}
        `
        Object.keys(filters[key]).map( field => {
          query = `${query} ${field} = '${filters[key][field]}'`
        })
      })

      const results = await db.query(query)

      return results.rows[0]

    } catch (err) {
      console.error(err)
    }

  },
  async saveCreate(data) {

    try {
      const query = `
      INSERT INTO users (
      name,
      email,
      password,
      cpf_cnpj,
      cep,
      address
      ) VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id
      `
      // Hash of password - Cryptography
      const passwordHash = await hash(data.password, 8)
      
      const values = [
        data.name,
        data.email,
        passwordHash,
        data.cpf_cnpj.replace(/\D/g,""),
        data.cep.replace(/\D/g,""),
        data.address
      ]

      const results = await db.query(query,values)
      
      return results.rows[0].id

    } catch (err) {
      console.error(err)
    }
   
  },
  async saveUpdate(userID, objFields) {

    try {

      let query = `UPDATE users SET`

      Object.keys(objFields).map((key, index, array) => {
        if((index+1) < array.length){
          query = ` ${query}
            ${key} = '${objFields[key]}',`
        } else {
          // última query sem a ','
          query = ` ${query}
            ${key} = '${objFields[key]}'
            WHERE id = ${userID}
            RETURNING *`
        }
      })

      const result = await db.query(query)
      return result.rows[0]
      
    } catch (err) {
      console.error(err)
    }
  },
  async delete(userID){

    try {
        
      // pegar todos os produtos
      let resuts = ProductsModel.find(userID)
      const productsDB = (await resuts).rows

      // pegar todas as imagens
      const allFilesPromise = await productsDB.map(product => ProductsModel.files(product.id))
      let promiseResults = await Promise.all(allFilesPromise)
      
      // remover o usuário
      await db.query('DELETE FROM users WHERE id = $1', [userID])

      // remover as imagens do arquivo
      promiseResults.map(results => {
        results.rows.map(file => {
          try {
            fs.unlinkSync(file.path)
          } catch (err) {
            console.error(err)
          }
        })
      })
        
    } catch (err) {
      console.error(err)

    }

  }
}
