const User = require('../user.model');

async function userInfo (req, res, next) {
  try {
    const user = await User.findOne({ _id: req.userData._id }, 'firstName lastName email phone gender birthday profileImage offers');
    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send('Internal server error');
  }
}

module.exports = userInfo;