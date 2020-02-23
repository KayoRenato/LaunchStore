const db = require('../../config/db')
const fs = require('fs')

module.exports ={
  saveFiles({filename, path, product_id}) {
    const query = `
      INSERT INTO files (
        name,
        path,
        product_id
      ) VALUES ($1,$2,$3)
      RETURNING id
    `
    
    const values = [
      filename,
      path,
      product_id
    ]

    return db.query(query,values)
  },
  async deleteFile(id){

    try{
      // fazendo consulta do DB para pegar o path do file que será deletado
      let file = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      file = file.rows[0]
  
      // Deleta o arquido do path informado
      fs.unlinkSync(file.path)
      return db.query(`DELETE FROM files WHERE id = $1`, [id])
      
    }catch(err){console.error(err)}

  }
}