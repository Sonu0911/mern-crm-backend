const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String },
  company:   { type: String },
  status:    { type: String, enum: ['Lead','Prospect','Customer'], default: 'Lead' },
  notes:     { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

contactSchema.index({ name: 'text', email: 'text' });
module.exports = mongoose.model('Contact', contactSchema);