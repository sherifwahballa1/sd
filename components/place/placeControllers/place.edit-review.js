const mongoose = require('mongoose');

const Review = require('../review.model');
const Place = require('../place.model');
const { addReview: addReviewValidationSchema } = require('../place.validation');

async function editReview (req, res, next) {
  try {
    const { reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ message: 'Invalid place' });
    const { error, value } = addReviewValidationSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message.replace(/"/g, '') });

    const review = await Review.findOne({ _id: reviewId });
    if (!review) return res.status(400).send({ message: 'Review not found' });

    const [newComment, oldComment, newRate, oldRate] = [value.comment, review.comment, value.rate, review.rate];
    if (newComment === oldComment && newRate === oldRate) return res.status(409).send({ message: 'Updated review is identical to old review' });

    // should be a transaction
    await Review.updateOne({ _id: reviewId }, { ...value });
    const place = await Place.findOne({ _id: review.placeId });
    place.totalRate += newRate - oldRate;
    await place.save();

    return res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = editReview;