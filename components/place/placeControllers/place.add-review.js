const mongoose = require('mongoose');
const Place = require('../place.model');
const Review = require('../review.model');
const { addReview: addReviewValidationSchema } = require('../place.validation');

async function addReview (req, res, next) {
  try {
    const { placeId } = req.params;
    const { error, value } = addReviewValidationSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message.replace(/"/g, '') });
    if (!mongoose.Types.ObjectId.isValid(placeId)) return res.status(400).send({ message: 'Invalid place' });

    const place = await Place.findOne({ _id: placeId });
    if (!place) return res.status(400).send({ message: 'Invalid place' });

    let review = await Review.findOne({ userId: req.userData._id, placeId });
    if (review) return res.status(409).send({ message: 'Only one review is allowed' });

    // should be a transaction
    review = await Review.create({ userId: req.userData._id, placeId, ...value });
    place.totalRate += value.rate;
    place.reviewsCount++;
    await place.save();

    return res.status(201).send({ review });
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = addReview;