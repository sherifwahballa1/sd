const mongoose = require('mongoose');
const Place = require('../place.model');
const Review = require('../review.model');
const { getReviews: getReviewsValidationSchema } = require('../place.validation');

async function getReviews (req, res, next) {
  try {
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) return res.status(400).send({ message: 'Invalid place' });

    const { error, value } = getReviewsValidationSchema.validate(req.query, { stripUnknown: true });
    if (error) return res.status(400).send({ message: error.message.replace(/"/g, '') });

    const queryLimitNo = Number.parseInt(value.limitNo);
    const querySkipNo = Number.parseInt(value.pageNo) * queryLimitNo;

    const place = await Place.findOne({ _id: placeId });
    if (!place) return res.status(400).send({ message: 'Invalid place' });

    const userReview = await Review.findOne({ userId: req.userData._id, placeId }, '-__v')
      .populate('userId', '-_id firstName lastName profileImage');
    const otherReviews = await Review.find({ userId: { $ne: req.userData._id }, placeId }, '-__v')
      .sort({ updatedAt: 'desc' })
      .skip(querySkipNo)
      .limit(queryLimitNo)
      .populate('userId', 'firstName lastName profileImage');
    const otherReviewsCount = await Review.find({ userId: { $ne: req.userData._id }, placeId }).countDocuments();

    return res.status(200).send({ userReview, otherReviews, otherReviewsCount });
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = getReviews;