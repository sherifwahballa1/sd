const joi = require('@hapi/joi');

const placeFieldsSchema = {
  name: joi.string()
    .trim()
    .lowercase()
    .ruleset
    .min(2)
    .max(50)
    .rule({ message: 'place name must be at least 2 to 50 characters long' }),
  description: joi.string()
    .trim()
    .max(255)
};

const searchSchema = {
  placeName: placeFieldsSchema.name.min(1)
    .allow(''),
  categoryName: placeFieldsSchema.name,
  pageNo: joi.string()
    .required()
    .trim()
    .pattern(/^[0-9]*$/) // find a way to limit the number according to number of documents
    .message('Enter a valid number'),
  limitNo: joi.string()
    .required()
    .trim()
    .pattern(/^[0-9]*$/) // find a way to limit the number according to number of documents
    .message('Enter a valid number')
};

const branchSchema = {
  name: joi.string()
    .required()
    .trim()
    .max(250)
    .message('Branch name must not exceed 250 characters'),
  city: joi.string()
    .required()
    .trim()
    .message('Enter a valid city'),
  area: joi.string()
    .required()
    .trim()
    .message('Enter a valid area'),
  street: joi.string()
    .required()
    .trim()
    .message('Enter a valid street'),
  building: joi.string()
    .trim()
    .message('Enter a valid building'),
  floor: joi.string()
    .trim()
    .message('Enter a valid floor'),
  phones: joi.string()
    .trim()
    .message('Enter a valid phone'),
  otherDetails: joi.string()
    .trim()
    .message('Enter valid details')
};

const getPlacesSchema = {
  pageNo: searchSchema.pageNo,
  limitNo: searchSchema.limitNo,
  sortBy: joi.string()
    .pattern(/^rate$|^default$/)
    .message('Sorting value must be either rate or default'),
  order: joi.string()
    .pattern(/^asc$|^desc$/)
    .message('Order value must be either asc or desc')
};

const addReviewSchema = {
  rate: joi.number()
    .required()
    .integer()
    .min(1)
    .max(5)
    .message('Rate must be a number between 1~5'),
  comment: joi.string()
    .trim()
    .allow('')
    .max(250)
    .message('Comment length cannot exceed 250 characters')
};

const getReviewsSchema = {
  pageNo: searchSchema.pageNo,
  limitNo: searchSchema.limitNo
};

module.exports = {
  addPlace: joi.object({
    name: placeFieldsSchema.name.required(),
    description: placeFieldsSchema.description
  }),
  search: joi.object(searchSchema),
  getPlaces: joi.object(getPlacesSchema),
  addReview: joi.object(addReviewSchema),
  addBranches: joi.array().min(1).items(joi.object(branchSchema)),
  getReviews: joi.object(getReviewsSchema)
};