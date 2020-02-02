/* eslint-disable no-multi-spaces */
const getAllCategories = require('./category.getAllCategories');      // get all categories (home page)

const addCategory = require('./category.addCategory');                // add a category (admin)

module.exports = {
  getAllCategories,
  addCategory
};