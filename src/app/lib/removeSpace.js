module.exports = {
  removeSpace(string){
    return string.split(',').map(item => item.trim())
  }
  // ,
  // removeEmpty: function(array){
  //   let newArray = []    
  //   array.map(item => {
  //       if(!item ==''){
  //       newArray.push(item)
  //       }
  //     })
  //   return console.log(newArray)
  // }
}