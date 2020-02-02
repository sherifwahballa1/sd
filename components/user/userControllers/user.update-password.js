const User = require('../user.model');
const { updatePassword: updatePasswordValidationSchema } = require('../user.validation');

async function updatePassword (req, res, next) {
  try {
    const { error, value } = updatePasswordValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });

    const user = await User.findOne({ _id: req.userData._id });
    const isPasswordValid = await user.isPasswordValid(req.body.oldPassword);
    if (!isPasswordValid) return res.status(409).send({ message: 'Invalid password' });

    if (value.oldPassword === value.newPassword) return res.status(409).send({ message: 'New password must not be the same as old password' });

    user.password = value.newPassword;
    await user.save();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = updatePassword;