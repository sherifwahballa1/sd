
const cloudinary = require('cloudinary').v2;
const config = require('../config');

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});




exports.upload = (file, folder) => {
  const cloudinaryUploadOption = { // cloudinary options
    resource_type: 'auto',
    folder
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, cloudinaryUploadOption, (err, result) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>', err);
      if (err) {reject(err);}
      else {
        resolve({
          url: result.url,
          name: result.public_id
        });
      }
    });
  });
};

exports.deleteOldImage = (id) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(id, (err, result) => {
      resolve({
        result
      });
    });
  });
};