const mongoose = require('mongoose');
const Place = require('../place.model');
const { CategoryVisitCount } = require('../../category');
const { getPlaces: getPlacesValidationSchema } = require('../place.validation');

async function getPlacesByCategory (req, res, next) {
  try {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return res.status(400).json({ message: 'Invalid Category name' });

    const { error, value } = getPlacesValidationSchema.validate(req.query, { stripUnknown: true });
    if (error) return res.status(400).send({ message: error.message.replace(/"/g, '') });

    const queryLimitNo = Number.parseInt(value.limitNo);
    const querySkipNo = Number.parseInt(value.pageNo) * queryLimitNo;
    // default ? sort by insertion order : sort by rate ascendingly or descendingly
    const sortBy = value.sortBy === 'rate' ? { rate: value.order } : '';

    const placesCount = await Place.find({ categoryId }).countDocuments();
    const places = await Place.find({ categoryId }, 'name logoURL totalRate reviewsCount')
      .sort(sortBy)
      .skip(querySkipNo)
      .limit(queryLimitNo);
    places.map(place => place.totalRate = (place.totalRate / place.reviewsCount).toFixed(1));
    await CategoryVisitCount.incVisitCount(req.userData._id, categoryId);

    return res.status(200).json({ places, placesCount });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getPlacesByCategory;