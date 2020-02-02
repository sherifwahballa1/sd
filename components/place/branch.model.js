const mongoose = require('mongoose');
const branchSchema = new mongoose.Schema({
  name: { type: String },
  city: { type: String },
  area: { type: String },
  street: { type: String },
  building: { type: String },
  floor: { type: String },
  phones: [{ type: String }],
  otherDetails: { type: String },

  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' }

}, { timestamps: true, usePushEach: true });

module.exports = mongoose.model('Branch', branchSchema);