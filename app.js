/** Multer for File upload  BEGIN **/

let express  = require('express');
const app      = express();

let path = require('path');
let bodyParser   = require('body-parser');
const multer  = require('multer');
const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://local:local@localhost:27017/supplySenseDb`, { useNewUrlParser: true });
const Schema = mongoose.Schema;
let async = require('async');

// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(bodyParser.json({limit: '500mb'}));

//static public folder
app.use(express.static('public'))

//Schema
const fileSchema = new Schema({
  name: {
    type: String
  },
  originalname: {
    type: String
  },
  path: {
    type: String
  },
  size: {
    type: Number
  },
  hexCode: {
    type: String
  },
  description: {
    type: String
  }
});
File = mongoose.model('files', fileSchema)

// storage, location everything
let storage = multer.diskStorage({
  destination: './upload/',
  filename: function (req, file, cb) {
      cb(null, req.files[0]['fieldname'] + path.extname(file.originalname))
    }
})

// generate random string for storing File
function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

const fileFilter = async (req, file, cb) => {
  let fileFound = await File.findOne({ $or : [ { name: new RegExp(req.body.name, 'gi') }, { hexCode: req.body.hexCode }] }); 
  if(fileFound){
    if(req.body.name.match(new RegExp(fileFound.name, 'gi')) && req.body.hexCode == fileFound.hexCode)
      cb("File Already exist with same Name and hexCode.", null);
    else if(req.body.hexCode == fileFound.hexCode)
      cb("File Already exist with Match hexCode.", null);
    else if(req.body.name.match(new RegExp(fileFound.name, 'gi')))
      cb("File Already exist with Same Name.", null);
    else
      cb("File Already Their.", null);
  } else {
    cb(null, true);
  }
};

let upload = multer({ 
  storage: storage,
  limits: {
      fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
// upload file using POST REQUEST
app.post('/uploadPDF', upload.any(), function(req, res){
  try{
    if (!req.files)
      res.status(400).send({status: false, message: "No file where uploaded."})
    else{
      let newFileSave = new File();
      newFileSave.name = req.body.name;
      newFileSave.originalname = req.files[0].originalname;
      newFileSave.path = req.files[0].path;
      newFileSave.size = req.files[0].size;

      newFileSave.hexCode = req.body.hexCode;
      newFileSave.description = req.body.description;

      newFileSave.save(function(err){
        if (err)
          return res.status(400).send({ status: false, message: JSON.stringify(err) })
        return res.json({
          status: true,
          timestamp: new Date(),
          baseUrl: req.baseUrl,
          message: 'File Uploaded Successfully',
          files:req.files,
          devMessage: 'Success'
        });
      })
    }
  }catch(e){
    console.log(e);
    res.status(400).send({status: false, message: e.TypeError})
  }
});


// GET request to access pdf.
app.get('/upload/:name', async (req, res) => {
    let exist = await File.findOne({ name: req.params.name });
    if(exist){
      return res.sendfile(path.resolve('.'+decodeURIComponent(exist.path)));
    } else {
      res.status(400).send({status: false, message: "which filed you request is not exist."})
    }
}); 
/** Multer for File upload  END **/

app.listen(8000, 'localhost');
console.log('The magic happens on port 8000');