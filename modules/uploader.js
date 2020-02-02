
const path = require('path');
const multer = require('multer');

module.exports = {
  upload: multer({
    dest: 'uploads/',
    limits: {
      // 10mb
      fileSize: 10000000
    },
    fileFilter (req, file, cb) {
      console.log(file.size);
      const filetypes = /jpeg|jpg/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb('invalid file type');
    }
  }),
  getErrorMessage (errCode) {
    switch (errCode) {
      case 'LIMIT_UNEXPECTED_FILE':
        return 'exceded number of files allowed';
      case 'LIMIT_FILE_SIZE':
        return 'file too large';
      default:
        return errCode;
    }
  }
};