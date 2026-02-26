const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['text', 'image', 'video'] },
  name: { type: String, required: true },
  role: { type: String },
  content: { type: String }, // Stores text OR the file path
  result: { type: String },
  rating: { type: Number, default: 5 },
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);