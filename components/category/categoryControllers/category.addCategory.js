const Category = require('../category.model');
const { category: categoryValidationSchema } = require('../category.validate');

async function addCategory (req, res, next) {
  try {
    const { error, value } = categoryValidationSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message.replace(/"/g, '') });

    let category = await Category.findOne({ categoryName: value.categoryName });

    if (category) return res.status(409).send({ message: 'Category already exists' });

    value.addedBy = req.userData._id;
    category = await Category.create(value);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = addCategory;