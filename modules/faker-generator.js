// Share mongoose instance and models with faker generator app
const mongoose = require('mongoose');
const config = require('../config');
const { User } = require('../components/user');
const { Place, Branch, Review } = require('../components/place');
const { Category, CategoryVisitCount } = require('../components/category');

module.exports = {
  mongoose,
  dbURI: config.dbURI
};