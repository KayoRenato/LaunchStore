const db = require('../../config/db')

module.exports ={
  saveCreate(data) {
      const query = `
        INSERT INTO products (
        category_id,
        user_id,
        name,
        description,
        old_price,
        price,
        quantity,
        status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING id

      `
      // Remover caracteres de moeda, deixando no formato int
      data.price = data.price.replace(/\D/g,"")
      
      const values = [
        data.category_id,
        data.users_id || 1,
        data.name,
        data.description,
        data.old_price || data.price,
        data.price,
        data.quantity,
        data.status || 1,
      ]

      return db.query(query,values)
  }

}