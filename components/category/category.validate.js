const joi = require('@hapi/joi');

const categorySchema = {
  categoryName: joi.string()
    .required()
    .trim()
    .lowercase()
    .ruleset
    .min(2)
    .max(40)
    .rule({ message: 'Length must be between 2~40 characters and consists of letters only' }),

  color: joi.string()
    .required()
    .trim()
    .lowercase()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .message('Color must consist of 3 or 6 hexadecimal characters'),

  imgUrl: joi.string()
    .required()
    .uri()
    .message('Enter a valid url')
};

module.exports = {
  category: joi.object(categorySchema)
};