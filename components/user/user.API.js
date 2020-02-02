const express = require('express');
const { login, signup, sendVerification, verifyOtp, updatePhone, editProfile, updatePassword, forgotPassword, resetPassword, userInfo } = require('./userControllers');
const security = require('../../security');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/user/signup', signup);
router.post('/user/login', login);

router.post('/user/request-verification-code', security.validateTempToken, sendVerification);
router.put('/user/update-phone', security.validateTempToken, updatePhone);
router.post('/user/verify', security.validateTempToken, verifyOtp);

router.get('/user/user-profile', security.auth(['user']), userInfo);
router.put('/user/edit-profile', security.auth(['user']), editProfile);
router.put('/user/update-password', security.auth(['user']), updatePassword);

router.post('/user/forgot-password', forgotPassword);
router.put('/user/reset-password', security.validateTempToken, resetPassword);

module.exports = router;