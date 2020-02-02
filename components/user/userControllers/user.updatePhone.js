const User = require('../user.model');
const { phone: phoneValidationSchema } = require('../user.validation');
const sendOtp = require('../../../modules/sms.API');


async function updatePhone (req, res, next) {
  try {
    // validate all data felids
    const { error, value } = phoneValidationSchema.validate(req.body);
    // there are error in the validation data not valid
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });

    const user = await User.findOne({ _id: req.userData._id });
    if (user.isVerified) return res.status(401).json({ message: 'User is already verified' });

    let timeInSeconds = (user.otpNextResendAt - new Date()) / 1000;
    const responseBody = {
      timeInSeconds,
      phone: user.phone,
      message: 'To update mobile number or resend verification please try again in'
    };
    if (user.otpNextResendAt > Date.now()) return res.status(400).json(responseBody);

    if (user.phone === value.phone) return res.status(409).send({ message: 'Phone already exists' });
    const isPhoneExist = await User.findOne({ phone: value.phone });
    if (isPhoneExist) return res.status(409).send({ message: 'Phone already exists' });

    user.phone = value.phone;
    user.updateOtp();
    await user.save();
    sendOtp(user.phone, user.otp);

    timeInSeconds = (user.otpNextResendAt - new Date()) / 1000;
    responseBody.timeInSeconds = timeInSeconds;
    responseBody.phone = user.phone;
    return res.status(200).send(responseBody);
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = updatePhone;