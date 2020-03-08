const Base = require("./Base")

Base.init({ table: 'files' })

module.exports = {
  ...Base
}


// async deleteFile(id){

//   try{
//     // fazendo consulta do DB para pegar o path do file que será deletado
//     let file = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
//     file = file.rows[0]

//     // Deleta o arquido do path informado
//     fs.unlinkSync(file.path)
//     return db.query(`DELETE FROM files WHERE id = $1`, [id])
  
//   }catch(err){console.error(err)}

// }