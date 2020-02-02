const { User, Place } = require('mongoose').models;

async function removePlaceFromFavorites (req, res, next) {
  try {
    const { placeId } = req.params;
    const place = await Place.findOne({ _id: placeId });
    if (!place) return res.status(400).send('Invalid place');

    await User.updateOne({ _id: req.userData._id }, { $pull: { favoritePlaces: placeId } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = removePlaceFromFavorites;