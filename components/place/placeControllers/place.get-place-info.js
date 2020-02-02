const mongoose = require('mongoose');
const Place = require('../place.model');
const Branch = require('../branch.model');

async function getPlaceInfo (req, res, next) {
  try {
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) return res.status(400).send({ message: 'Invalid place' });

    const place = await Place.findOne({ _id: placeId }, '-categoryId -addedBy -createdAt -updatedAt -__v');
    if (!place) return res.status(400).send({ message: 'Invalid place' });
    place.totalRate = (place.totalRate / place.reviewsCount).toFixed(1);

    const locations = await Branch.find({ placeId }, '-_id city area street building floor otherDetails');

    return res.status(200).send({ place, locations });
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = getPlaceInfo;