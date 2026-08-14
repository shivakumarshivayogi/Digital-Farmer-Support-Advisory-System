const mongoose = require('mongoose');

const CropAdvisorySchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Please provide a crop name'],
      unique: true,
      trim: true,
    },
    suitableSoil: {
      type: String,
      default: '',
    },
    growingConditions: {
      type: String,
      default: '',
    },
    waterRequirements: {
      type: String,
      default: '',
    },
    sowingInfo: {
      type: String,
      default: '',
    },
    growthDuration: {
      type: String,
      default: '',
    },
    commonDiseases: [
      {
        type: String,
      },
    ],
    pestInfo: {
      type: String,
      default: '',
    },
    preventionGuidance: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=600',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CropAdvisory', CropAdvisorySchema);
