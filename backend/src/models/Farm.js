const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema(
  {
    farmName: {
      type: String,
      required: [true, 'Please provide a farm name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide farm location or village'],
      trim: true,
    },
    district: {
      type: String,
      default: '',
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    area: {
      type: Number,
      required: [true, 'Please specify farm area'],
      min: [0.1, 'Farm area must be greater than 0'],
    },
    areaUnit: {
      type: String,
      enum: ['Acres', 'Hectares', 'Guntha', 'Bigha'],
      default: 'Acres',
    },
    soilType: {
      type: String,
      default: 'Alluvial',
      trim: true,
    },
    irrigationType: {
      type: String,
      default: 'Borewell',
      trim: true,
    },
    waterSource: {
      type: String,
      default: 'Groundwater',
      trim: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Farm', FarmSchema);
