module.exports = {
  
  age(timestamp){

    const today = new Date()
    const birthDate = new Date(timestamp)

    let age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth() - birthDate.getMonth()
    const day = today.getDate() - birthDate.getDay()

    if(month < 0 || month == 0 && day < 0) {
      age -=1
    }
    
    return age
  },
  date(timestamp){
    const date = new Date(timestamp)

    day = `0${date.getUTCDate()}`.slice(-2)
    month = `0${date.getUTCMonth()+1}`.slice(-2)
    year = `${date.getUTCFullYear()}`

    return {
      day,
      month,
      year,
      iso:`${year}-${month}-${day}`,
      birthDay: `${day}/${month}`
    }
  }
}
