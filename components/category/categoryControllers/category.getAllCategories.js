const Category = require('../category.model');

async function getAllCategories (req, res, next) {
  try {
    const categories = await Category.find({}, '-createdAt -updatedAt -__v -addedBy').lean();
    return res.status(200).send(categories);
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = getAllCategories;