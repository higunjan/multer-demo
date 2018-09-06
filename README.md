# Tesseract Image text reader with Multer file upload 

#### 1. In HTML you've to load tesseract lib `tesseract.dev.js`

#### 2. On change event of file input you have to do following `config.json`
```sh
Tesseract
          .recognize(this.files[0])  // Recognise the file which you selected
          .progress(function(data){  // Process of file take some time based on image
            console.log(data)
          })
          .then(function(data){  // Once read completed it return an object with multiple details, of images you can filter-out
            console.log(data); 
          });
```
