/* eslint-disable no-multi-spaces */
const getPlacesByCategory = require('./place.getPlacesByCategory');     // get all places for a specific category
const placeSearch = require('./place.search');                          // find all places that match search criteria
const getPlaceInfo = require('./place.get-place-info');                 // place home page -> get all place's info

const addReview = require('./place.add-review');                        // add user's review to a place
const getReviews = require('./place.get-reviews');                      // get users reviews for a place
const editReview = require('./place.edit-review');

const addNewPlace = require('./place.addNewPlace');                     // add new place (admin)
const addBranches = require('./place.addBranches');                     // add branch to a place (admin)

const uploadMenuImgs = require('./place.uploadMenuImgs');               // upload place menu images (admin)
const uploadGalleryImgs = require('./place.uploadGalleryImgs');         // upload place gallery images (admin)
const uploadLogoCoverImgs = require('./place.uploadLogoCover');         // upload logo and cover images (admin)

const getFavoritePlaces = require('./place.get-favorite-places');       // get user's favorite places list
const addPlaceToFavorites = require('./place.add-place-to-favorites');  // add place to user's favorites list
const removePlaceFromFavorites = require('./place.remove-place-from-favorites');  // remove place from user's favorite list

module.exports = {
  getPlacesByCategory,
  addNewPlace,
  uploadLogoCoverImgs,
  placeSearch,
  uploadMenuImgs,
  uploadGalleryImgs,
  addReview,
  addBranches,
  getReviews,
  getPlaceInfo,
  editReview,
  addPlaceToFavorites,
  getFavoritePlaces,
  removePlaceFromFavorites
};