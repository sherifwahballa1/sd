const mongoose = require('mongoose');
const placeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

  logoURL: { url: { type: String }, name: { type: String } },
  coverURL: { url: { type: String }, name: { type: String } },

  galleryURLs: [{
    url: { type: String },
    name: { type: String } // as cloudinary id for removing
  }],
  menuURLs: [{
    url: { type: String },
    name: { type: String } // as cloudinary id for removing
  }],

  offers: [{
    title: { type: String },
    description: { type: String }
  }],

  contact: {}, // object of contacts like {fb:"link to fb page" , ....}

  totalRate: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },

  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

}, {
  timestamps: true,
  usePushEach: true
});

module.exports = mongoose.model('Place', placeSchema);