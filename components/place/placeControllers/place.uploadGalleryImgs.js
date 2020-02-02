const mongoose = require('mongoose');
const fs = require('fs');
const cloudinary = require('../../../modules/cloudinary');
const Place = require('../place.model');
// const { Category } = require('../../category');


async function uploadGalleryImgs (req, res, next) {
  try {
    // validate place id as mongo id
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) return res.status(400).json({ message: 'Invalid place name' });
    if (!req.files || !req.files['gallery']) return res.status(400).json({ message: 'insert images' });

    // find the place in DB
    const targetedPlace = await Place.findOne({ _id: placeId });
    if (!targetedPlace) return res.status(400).json({ message: ' place not found' });

    // upload img to cloudinary and save urls to
    const galleryImages = req.files['gallery'];
    const galleryImagesURLs = [];
    const oldGalleryImageURLs = targetedPlace.galleryURLs;

    for (const img of galleryImages) {
      const { path } = img;
      const newPath = await cloudinary.upload(path, `${targetedPlace.name}/gallery`);
      // remove old image from cloud
      galleryImagesURLs.push(newPath);
      fs.unlink(path, (err) => {
        if (err) console.log('image not deleted ::  ', path);
      });
    }
    targetedPlace.galleryURLs = galleryImagesURLs;
    // save updated place
    await targetedPlace.save();

    for (let i = 0; i < oldGalleryImageURLs.length; i++) {
      await cloudinary.deleteOldImage(oldGalleryImageURLs[i].name);
    }

    return res.status(200).json({ galleryImagesURLs });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = uploadGalleryImgs;