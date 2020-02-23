const Mask = {
  apply(input, func) {
    setTimeout(()=>{
      input.value = Mask[func](input.value)
    },1)
  },

  formatBRL(value){
    value = value.replace(/\D/g,"")
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value/100)
  }
}

const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  files: [],
  handleFileInput(event){
    const { files: fileList } = event.target
    PhotosUpload.input = event.target

    if(PhotosUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      PhotosUpload.files.push(file)      
      
      const reader = new FileReader() //criar um arquivo tipo BLOB (Binary Large Object - Pode conter até 4Gb de dados binários)

      // Quando Carrega o arquivo img cria toda estrutura HTML para o frontend
      reader.onload = () => {
        const image = new Image() //<img/> no HTML
        image.src = String(reader.result)

        const div = PhotosUpload.createContainer(image)

        PhotosUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file) // ler o arquivo img

    })

    // substituindo os files intransmutável pelo files criado no getAllFiles
    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimit(event){
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input

    if(fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos!`)
      event.preventDefault()
      return true
    }

    const photosContainer = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == "photo") 
        photosContainer.push(item)
    })

    const totalPhotos = fileList.length + photosContainer.length
    if(totalPhotos > uploadLimit) {
      alert(`Você atingiu o limite máximo de ${uploadLimit} fotos!`)
      event.preventDefault()
      return true
    }

    return false;
  },
  getAllFiles(){
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files

  },
  createContainer(image){

    const container = document.createElement('div')

    container.classList.add('photo')
    container.onclick = PhotosUpload.removeImgBeforeDB

    container.appendChild(image)
    container.appendChild(PhotosUpload.createIconRemove())

    return container
    
  },
  createIconRemove(){
    const icon = document.createElement('i')
    icon.classList.add('fas', 'fa-trash-alt')
    return icon
  },
  removeImgBeforeDB(event){
    const photoDiv = event.target.parentNode //selecionar o elemento PAI do elemento DOM
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    // removendo file do files criado na posição do index
    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()
    photoDiv.remove();
  },
  removeImgAfterDB(event){
    const photoDiv = event.target.parentNode //selecionar o elemento PAI do elemento DOM

    if(photoDiv.id){
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if(removedFiles){
        removedFiles.value += `${photoDiv.id},`
      }
    }


    photoDiv.remove();
  }
}