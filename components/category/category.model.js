const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  imgUrl: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Change User to Admin after it's implemented
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);