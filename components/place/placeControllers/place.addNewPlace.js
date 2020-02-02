const mongoose = require('mongoose');
const Place = require('../place.model');
const { Category } = require('../../category');
const { addPlace: addPlaceValidationSchema } = require('../place.validation');

async function addNewPlace (req, res, next) {
  try {

    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return res.status(400).json({ message: 'Invalid Category name' });

    const { error, value } = addPlaceValidationSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });

    const existPlace = await Place.findOne({ name: value.name });
    if (existPlace) return res.status(409).json({ message: 'place exist , duplicated name' });

    const existCategory = await Category.findOne({ _id: categoryId });
    if (!existCategory) return res.status(400).json({ message: 'Invalid Category Id' });

    value.categoryId = categoryId;
    value.contact = req.body.contact;
    value.addedBy = req.userData._id;

    const newPlace = await Place.create(value);
    return res.status(200).json({ Place: newPlace });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = addNewPlace;