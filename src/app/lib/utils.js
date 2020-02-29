const Intl = require('intl') // o Intl pré instalado no node apresenta erro e não consegue regionalizar. Logo é preciso reinstalar e a biblioteca e chamar no arquivo.
module.exports = {
  
  date(timestamp){
    const date = new Date(timestamp)

    const day = `0${date.getDate()}`.slice(-2)
    const month = `0${date.getMonth()+1}`.slice(-2)
    const monthExt = new Intl.DateTimeFormat('pt-BR', {month: 'long'}).format(timestamp)
    const year = date.getFullYear()
    const hour = date.getHours()
    const minutes = `0${date.getMinutes()}`.slice(-2)

    return {
      day,
      month,
      monthExt,
      year,
      hour,
      minutes,
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
