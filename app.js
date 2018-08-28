/** Multer for File upload  BEGIN **/
const multer  = require('multer');
const misc = require.cache.misc;
// storage, location everything
let storage = multer.diskStorage({
  destination: './upload/',
  limits: {
      fileSize: '50MB'
  },
  filename: function (req, file, cb) {
      cb(null, "file_"+Date.now()+"_"+randomString(10) + path.extname(file.originalname))
    }
})

// generate random string for storing File
function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

let upload = multer({ storage: storage });

// upload file using POST REQUEST
app.post('/uploadPDF', upload.any(), function(req, res){
  try{
    if (!req.files)
      res.status(400).send({status: false, message: "No file where uploaded."})
    else{
      // Before response whatever you want to store in database.
      res.json({
        timestamp: new Date(),
        baseUrl: req.baseUrl,
        message: 'File Uploaded Successfully',
        files:req.files,
        devMessage: 'Success'
      });
    }
  }catch(e){
    res.status(400).send({status: false, message: JSON.stringify(e)})
  }
});


// GET request to access pdf.
app.get('/upload/:name', function (req, res) {
    fs.exists('.'+decodeURIComponent(req.url), function(exists){
        if (exists) {
            return res.sendfile(path.resolve('.'+decodeURIComponent(req.url)));
        }else{
          res.status(400).send({status: false, message: "which filed you request is not exist."})
        }
    })
}); 
/** Multer for File upload  END **/
