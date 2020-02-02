
const { login: loginValidationSchema } = require('../user.validation');
const User = require('../user.model');
const securityModule = require('../../../security');

async function login (req, res, next) {

  try {
    const { error, value } = loginValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });

    const user = await User.findOne({ $or: [{ email: value.email }, { phone: value.email }] }, 'firstName lastName email phone gender birthday profileImage offers role isVerified password');
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isPasswordValid = await user.isPasswordValid(value.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid username or password' });

    if (!user.isVerified) return res.status(403).json({ token: user.signTempJWT() });

    user.isVerified = undefined;
    user.password = undefined;
    securityModule.buildTicket(user, function (token) {
      return res.status(200).json({ token, userData: user });
    });
  }
  catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = login;