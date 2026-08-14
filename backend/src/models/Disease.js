const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide disease name'],
      trim: true,
    },
    crop: {
      type: String,
      required: [true, 'Please specify affected crop'],
      trim: true,
      index: true,
    },
    symptoms: {
      type: String,
      default: '',
    },
    causes: {
      type: String,
      default: '',
    },
    prevention: {
      type: String,
      default: '',
    },
    management: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb247a5?auto=format&fit=crop&q=80&w=600',
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Disease', DiseaseSchema);
