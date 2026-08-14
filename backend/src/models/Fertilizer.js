const mongoose = require('mongoose');

const FertilizerSchema = new mongoose.Schema(
  {
    fertilizerName: {
      type: String,
      required: [true, 'Please provide fertilizer name'],
      trim: true,
    },
    crop: {
      type: String,
      required: [true, 'Please specify target crop'],
      trim: true,
      index: true,
    },
    nutrient: {
      type: String,
      default: 'NPK Blend',
      trim: true,
    },
    generalGuidance: {
      type: String,
      default: '',
    },
    precautions: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Fertilizer', FertilizerSchema);
