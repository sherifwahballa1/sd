const mongoose = require('mongoose');

const categoryVisitCountSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visitCount: { type: Number, default: 0 },
  incVisitCountAt: { type: Date, required: true }
});

categoryVisitCountSchema.statics.incVisitCount = async function (userId, categoryId) {
  return await this.updateOne({ userId, categoryId },
    { userId, categoryId, $inc: { visitCount: 1 }, incVisitCountAt: new Date() },
    { upsert: true });
};

module.exports = mongoose.model('Category-Visit-Count', categoryVisitCountSchema);