/* eslint-disable no-multi-spaces */
const signup = require('./user.signup');
const login = require('./user.login');

const sendVerification = require('./user.send-verification');                 // send SMS to user with OTP
const updatePhone = require('./user.updatePhone');                            // update user's phone and resend OTP
const verifyOtp = require('./user.verify');                                   // verify user's OTP

const userInfo = require('./user.user-info');                                 // get user info
const editProfile = require('./user.edit-profile');                           // edit user's data
const updatePassword = require('./user.update-password');                     // update user's password

const forgotPassword = require('./user.forgot-password');                     // send OTP to user to reset password
const resetPassword = require('./user.reset-password');                       // verify OTP and reset password

module.exports = {
  login,
  signup,
  sendVerification,
  verifyOtp,
  updatePhone,
  editProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  userInfo
};