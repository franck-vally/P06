// Packages suplémentaires

const multer = require('multer');

const jimp = require('jimp');

// dictonnaire pour doner les extention des formats d'images en fonction de leurs mimetypes
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif' : 'gif',
};



//Création d'une constante  indique la destination du fichier entrant et lui donner un nom avec filename
/*
function faireQqc() {
  return new Promise((successCallback, failureCallback) => {
    console.log("C'est fait");
    // réussir une fois sur deux
    if (Math.random() > .5) {
      successCallback("Réussite");
    } else {
      failureCallback("Échec");
    }
  })
}

const promise = faireQqc();



promise.then(function(){
  jimp.read('images/sauces_piquantes_' + name +  Date.now() + '.' + extension)
  .then(lenna => {
    return lenna
      .resize(256, 256) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write('images/sauces_piquantes_' + name +  Date.now() + '.' + extension); // save
  })
  .catch(err => {
    console.error(err);
  });
}, function(){
  console.error(err);
});
*/
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
      var ext = path.extname(file.originalname);
      if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
          return callback(new Error('Only images are allowed'))
      }
      callback(null, true)
  }
}).single('userFile');


const storage = multer.diskStorage({
  
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];

    
      
    callback(null, 'sauces_piquantes_' + name +  Date.now() + '.' + extension);
    let nomImage = 'sauces_piquantes_' + name +  Date.now() + '.' + extension
    
jimp.read(nomImage)
  .then(lenna => {
    return lenna
      .resize(256, 256) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write(nomImage); // save
  })
  .catch(err => {
    console.error(err);
  });


  }
  
});


module.exports = multer({storage: storage}).single('image');