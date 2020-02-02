const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../../config');

const userSchema = new mongoose.Schema({
  // sign up
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  birthday: { type: Date, required: true },

  offers: [{ type: String }],
  profileImage: { type: String },
  favoriteCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  favoritePlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],

  // verification
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpNextResendAt: { type: Date, default: Date.now },
  otpRequestCounter: { type: Number, default: 0 },

  forgotPasswordNextResetAt: { type: Date, default: Date.now },
  forgotPasswordResetCounter: { type: Number, default: 0 },

  // for security
  role: { type: String, default: 'user' }
},
{ timestamps: true, usePushEach: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await this.hashPassword(this.password, 10);
});

userSchema.methods.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// check Password Validation
userSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.signTempJWT = function () {
  return jwt.sign({ _id: this._id }, config.tempTokenSecret, { expiresIn: `${config.tempTokenDurationInHours }h` });
};

userSchema.methods.updateOtp = function () {
  let blockTimeInMinutes = 1;

  // block user for 1h if he made 5 requests
  // otherwise block user for 1 minute
  if (this.otpRequestCounter === 4) {
    blockTimeInMinutes = 60;
    this.otpRequestCounter = -1;
  }
  // generate 6-digits OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  // add 60 seconds to next resend time
  const nextResendTime = new Date().getTime() + blockTimeInMinutes * 60000;

  this.otp = otp;
  this.otpNextResendAt = new Date(nextResendTime);
  this.otpRequestCounter++;
};

userSchema.methods.updateResetPasswordCounter = function () {
  let blockTimeInMinutes = 3;

  // block user for 3h if he made 3 requests
  // otherwise block user for 3 minutes
  if (this.forgotPasswordResetCounter === 2) {
    blockTimeInMinutes = 3 * 24 * 60; // 3Days
    this.forgotPasswordResetCounter = -1;
  }
  // add 3 minutes to next resend time
  const nextResendTime = new Date().getTime() + blockTimeInMinutes * 60000;

  this.forgotPasswordNextResetAt = new Date(nextResendTime);
  this.forgotPasswordResetCounter++;
};

module.exports = mongoose.model('User', userSchema);