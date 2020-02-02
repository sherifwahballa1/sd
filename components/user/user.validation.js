const joi = require('@hapi/joi');

const signupSchema = {
  firstName: joi.string()
    .required()
    .trim()
    .lowercase()
    .ruleset
    .pattern(/^[a-zA-Z]+$/)
    .min(2)
    .max(20)
    .rule({ message: 'First name length must be between 2~20 characters and consists of letters only' }),

  lastName: joi.string()
    .required()
    .trim()
    .lowercase()
    .ruleset
    .pattern(/^[a-zA-Z]+$/)
    .min(2)
    .max(20)
    .rule({ message: 'Last name length must be between 2~20 characters and consists of letters only' }),

  password: joi.string()
    .required()
    .trim()
    .pattern(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .message('Password must be at least a minimum of 8 characters long with 1 small letter, 1 capital letter, 1 number and 1 special character'),

  phone: joi.string()
    .required()
    .trim()
    .ruleset
    .pattern(/(01)[0125][0-9]{8}/)
    .max(11)
    .rule({ message: 'Phone must consist of 11 numbers and starts with 01' }),

  email: joi.string()
    .required()
    .email()
    .lowercase()
    .message('Invalid email'),

  gender: joi.string()
    .required()
    .lowercase()
    .pattern(/^male$|^female$/)
    .message('Gender must be either male or female'),

  birthday: joi.date()
    .required()
    .max(new Date().setFullYear(new Date().getFullYear() - 12))
    .message('You must be at least 12 years old to signup')
};

const loginSchema = {
  email: joi.alternatives().try(
    joi.string()
      .email()
      .trim()
      .lowercase(),
    joi.string()
      .trim()
      .ruleset
      .pattern(/(01)[0-9]{9}/)
      .max(11)
      .rule({ message: 'Phone must consist of 11 numbers and starts with 01' })
  ).required(),
  password: joi.string()
    .required()
    .trim()
};

const otpSchema = {
  code: joi.string()
    .required()
    .trim()
    .ruleset
    .length(6)
    .pattern(/[0-9]{6}/)
    .rule({ message: 'invalid code' })
};


const editProfileSchema = {
  ...signupSchema
};
delete editProfileSchema.password;
delete editProfileSchema.phone;
delete editProfileSchema.birthday;

const updatePasswordSchema = {
  oldPassword: signupSchema.password,
  newPassword: signupSchema.password
};

module.exports = {
  signup: joi.object(signupSchema),
  login: joi.object(loginSchema),
  otp: joi.object(otpSchema),
  phone: joi.object({ phone: signupSchema.phone }),
  editProfile: joi.object(editProfileSchema),
  updatePassword: joi.object(updatePasswordSchema),
  forgotPassword: joi.object({ email: loginSchema.email }),
  resetPassword: joi.object({ password: signupSchema.password })
};