const db = require('../../config/db')

function find(filters, table){
  let query = `SELECT * FROM ${table}`

  if(filters){ 
    Object.keys(filters).map(key => {
      // WHERE || OR || AND
      query += `${key}`

      Object.keys(filters[key]).map( field => {
        query += ` ${field} = '${filters[key][field]}'`
      })
    })
  }
 

  return db.query(query)
}

const Base = {
  init({ table }) {
    if(!table) throw new Error("Invalid Params")

    this.table = table
    return this
  },
  async find(id){

    try {
      const results = await find({WHERE: {id}}, this.table)
      return results.rows[0]

    } catch (err) {
      console.error(err)
    }

  },
  async findOne(filters){

    try {
      const results = await find(filters, this.table)
      return results.rows[0]

    } catch (err) {
      console.error(err)
    }

  },
  async findAll(filters){

    try {
      const results = await find(filters, this.table)
      return results.rows

    } catch (err) {
      console.error(err)
    }

  },
  async saveCreate(fields){
    try {

      let keys = [], values = []
          
      Object.keys(fields).map( key => {
        keys.push(key)
        values.push(`'${fields[key]}'`)
      })
          
      const query = `INSERT INTO ${this.table} (${keys.join(",")})
        VALUES (${values.join(",")})
        RETURNING id`

      const results = await db.query(query)
      return results.rows[0].id

    } catch (err) {
      console.error(err)
    }
  },
  async saveUpdate(id, fields) {
    try {

      let fieldsUpdate = [] 
      
      Object.keys(fields).map( key => {
        const inputUpdate = `${key} = '${fields[key]}` // category_id = '$1'
        fieldsUpdate.push(inputUpdate)
      })

      let query = `UPDATE ${this.table} SET
        ${fieldsUpdate.join(",")} WHERE id = ${id}
        RETURNING *`
      
      const result = await db.query(query)
      return result.rows[0]
      
    } catch (err) {
      console.error(err)
    }
  },
  delete(id){
    return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
  }

}

module.exports = Base