const mongoose = require('mongoose');
const { User, Place } = require('mongoose').models;

async function addPlaceToFavorites (req, res, next) {
  try {
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) return res.status(400).send({ message: 'Invalid place' });

    const place = await Place.findOne({ _id: placeId }).lean();
    if (!place) return res.status(400).send({ message: 'Invalid place' });

    await User.updateOne({ _id: req.userData._id, favoritePlaces: { $ne: placeId } }, { $push: { favoritePlaces: placeId } });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = addPlaceToFavorites;