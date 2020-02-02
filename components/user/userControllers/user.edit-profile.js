const User = require('../user.model');
const { editProfile: editProfileValidationSchema } = require('../user.validation');

async function editProfile (req, res, next) {
  try {
    const { error, value } = editProfileValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });

    const user = await User.updateOne({ _id: req.userData._id }, value);
    if (user.nModified !== 1) return res.status(400).send({ message: 'User is not updated, try again later' });

    return res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = editProfile;