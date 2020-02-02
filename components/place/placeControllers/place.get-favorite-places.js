const { User } = require('mongoose').models;

async function getFavoritePlaces (req, res, next) {
  try {
    const { favoritePlaces } = await User.findOne({ _id: req.userData._id }, '-_id favoritePlaces')
      .populate('favoritePlaces', 'name logoURL');
    return res.status(200).send(favoritePlaces);
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = getFavoritePlaces;