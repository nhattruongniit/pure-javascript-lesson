window.onload = function(e) {

  const listImages = [];
  const inputFile = document.getElementById('inputFile');
  const image = document.getElementById('image');
  const output = document.getElementById('output');
  
  console.log(inputFile)
  
  const reader = new FileReader();
  inputFile.onchange = function(event) {
    image.src = event.target.files[0].name
    readImage(event.target.files[0], image)
  }
  
  function niceBytes(x){
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;
    while(n >= 1024 && ++l){
        n = n/1024;
    }
    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
  }
  
  function readImage(file, img) {
    // Check if the file is an image.
    if (file.type && !file.type.startsWith('image/')) {
      console.log('File is not an image.', file.type, file);
      return;
    }
    output.innerHTML = '';
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      img.src = event.target.result;
      const newImage = {
        id: Date.now(),
        url: event.target.result,
        name: file.name,
        size: file.size,
      }
      listImages.push(newImage)
      for(const image of listImages) {
        output.innerHTML += `
          <div class="card">
            <img class="card-img-top" src=${image.url} alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${image.name}</h5>
              <p class="card-text">Size: ${niceBytes(image.size)}</p>
              <a href="javascript:;" class="btn btn-primary">Remove</a>
            </div>
          </div>
        `
      }
    });
    reader.readAsDataURL(file);
  }
  
}