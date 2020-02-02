const User = require('../user.model');
const { forgotPassword: forgotPasswordValidationSchema } = require('../user.validation');
const sendOtp = require('../../../modules/sms.API');

async function forgotPassword (req, res, next) {
  try {
    const { error, value } = forgotPasswordValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });

    const user = await User.findOne().or([{ email: value.email }, { phone: value.email }]);

    if (!user) return res.status(404).send({ message: 'User not found, enter a valid email or phone' });
    if (user.forgotPasswordNextResetAt > Date.now()) return res.status(400).send({ message: 'Try again later' });
    if (user.otpNextResendAt > Date.now()) return res.status(400).send({ message: 'Try again later' });

    user.updateOtp();
    user.updateResetPasswordCounter();
    await user.save();

    sendOtp(user.phone, user.otp);
    const token = user.signTempJWT();

    return res.status(200).send({ token, email: value.email });
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = forgotPassword;