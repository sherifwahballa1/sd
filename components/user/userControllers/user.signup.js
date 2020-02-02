const User = require('../user.model');
const { signup: signupValidationSchema } = require('../user.validation');

async function signup (req, res, next) {
  try {
    const { error, value } = signupValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });

    let user = await User.findOne().or([{ email: value.email }, { phone: value.phone }]);

    if (user) return res.status(409).json({ message: (user.email === value.email) ? 'Email already exists' : 'Phone already exists' });

    user = await User.create(value);
    const token = user.signTempJWT();

    return res.status(201).send({ token });
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = signup;