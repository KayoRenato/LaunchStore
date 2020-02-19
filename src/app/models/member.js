const { date } = require('../lib/date')
const { removeSpace } = require('../lib/removeSpace')
const db = require('../../config/db')

module.exports = {
  all(callback){ 
    db.query(
    `
    SELECT * FROM members
    ORDER BY name ASC
    `
    , (err, results)=>{
        if(err) throw   `Database Error! ${err}`

        callback(results.rows)
    })
  },
  save(data, callback){
    const query = 
    `
      INSERT INTO members (
        avatar_url,
        name,
        email,
        birth,
        gender,
        blood,
        height,
        weight,
        services,
        create_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `

    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth).iso,
      data.gender,
      data.blood,
      data.height,
      data.weight,
      removeSpace(data.services),
      date(Date.now()).iso
    ]

    db.query(query, values, (err, results) =>{
      if(err) throw   `Database Error! ${err}`

      callback(results.rows[0])
    })
  },
  find(id, callback){
    db.query(
      `
        SELECT members.*, instructors.name AS instructor_name
        FROM members 
        LEFT JOIN instructors ON (members.instructor_id = instructors.id)
        WHERE members.id = $1
      `
      , [id]
      , function(err, results){
          if(err) throw   `Database Error! ${err}`

          callback(results.rows[0])
        }
    )
  },
  update(data, callback){
    const query =
    `
      UPDATE members SET
        avatar_url = ($1),
        name = ($2),
        email = ($3),
        birth = ($4),
        gender = ($5),
        blood = ($6),
        height = ($7),
        weight = ($8),
        services = ($9)
      WHERE id = $10
    `

    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth).iso,
      data.gender,
      data.blood,
      data.height,
      data.weight,
      removeSpace(data.services),
      data.id
    ]

    db.query(query, values, function(err, results){
      if(err) throw   `Database Error! ${err}`

      callback()
    })

  },
  delete(id, callback){
    db.query(
      `
      DELETE FROM members WHERE id = $1
      `,
      [id],
      function(err, results){
        if(err) throw  `Database Error! ${err}`
  
        return callback()
      })

  },
  paginate(params){
    const {filter, limit, offset, callback} = params
    
    let query = '',
        filterQuery = '',
        totalQuery = `(
          SELECT count(*) FROM members
        ) AS total`

    if(filter){

      filterQuery= `
      WHERE members.name ILIKE '%${filter}%'      
      `
      totalQuery = `(
        SELECT count(*) FROM members
        ${filterQuery}
      ) AS total`
    }

  // (SELECT count(members) AS total_members)
    query = `
    SELECT members.*, ${totalQuery}
    FROM members
    ${filterQuery}
    LIMIT $1 OFFSET $2
    `

    db.query(query, [limit, offset], function(err, results){
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })


  }         
} 