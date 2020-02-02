const express = require('express');
const { getPlacesByCategory, addNewPlace, uploadLogoCoverImgs, uploadMenuImgs, uploadGalleryImgs, placeSearch, addBranches, addReview, getReviews, editReview, getPlaceInfo, addPlaceToFavorites, getFavoritePlaces, removePlaceFromFavorites } = require('./placeControllers');
const security = require('../../security');
const multer = require('../../modules/multer');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/places/:categoryId', security.auth(['user']), getPlacesByCategory);
router.get('/place/search', security.auth(['user']), placeSearch);
router.get('/place/:placeId/info', security.auth(['user']), getPlaceInfo);

router.post('/place/:placeId/add-review', security.auth(['user']), addReview);
router.get('/place/:placeId/get-reviews', security.auth(['user']), getReviews);
router.put('/place/:reviewId/edit-review', security.auth(['user']), editReview);

router.post('/place/:categoryId/add-new', security.auth(['superAdmin', 'admin']), addNewPlace);
router.post('/place/add-branches/:placeId', security.auth(['superAdmin', 'admin']), addBranches);

router.post('/place/upload-menu-img/:placeId',
  security.auth(['superadmin', 'admin']),
  multer.fields([{ name: 'menu', maxCount: 30 }]),
  uploadMenuImgs
);
router.post('/place/upload-gallery-img/:placeId',
  security.auth(['superadmin', 'admin']),
  multer.fields([{ name: 'gallery', maxCount: 30 }]),
  uploadGalleryImgs
);
router.post('/place/upload-main-img/:placeId',
  security.auth(['superadmin', 'admin']),
  multer.fields([{ name: 'logo', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
  uploadLogoCoverImgs
);

router.get('/place/get-favorite-places', security.auth(['user']), getFavoritePlaces);
router.post('/place/:placeId/add-to-favorites', security.auth(['user']), addPlaceToFavorites);
router.put('/place/:placeId/remove-place-from-favorites', security.auth(['user']), removePlaceFromFavorites);

module.exports = router;