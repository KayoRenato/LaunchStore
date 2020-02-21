module.exports = {
  
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
  },

  formatPrice(price){
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price/100)
  }
}
