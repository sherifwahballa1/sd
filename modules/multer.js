const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename (req, file, cb) {
    cb(null, `${file.fieldname }-${ mongoose.Types.ObjectId() }${path.extname(file.originalname)}`);
  }
});

function imageFilter (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
}


const upload = multer({
  storage,
  imageFilter
});

module.exports = upload;