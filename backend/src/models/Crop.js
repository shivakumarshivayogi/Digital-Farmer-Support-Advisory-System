const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Please provide a crop name'],
      trim: true,
    },
    variety: {
      type: String,
      default: '',
      trim: true,
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: [true, 'Please select a farm plot'],
    },
    sowingDate: {
      type: Date,
      required: [true, 'Please provide the sowing date'],
    },
    expectedHarvestDate: {
      type: Date,
      default: null,
    },
    area: {
      type: Number,
      required: [true, 'Please specify cultivated area'],
      min: [0.01, 'Area must be greater than 0'],
    },
    season: {
      type: String,
      enum: ['Kharif', 'Rabi', 'Zaid', 'Whole Year'],
      default: 'Kharif',
    },
    soilType: {
      type: String,
      default: '',
      trim: true,
    },
    irrigationMethod: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['PLANNED', 'SOWN', 'GROWING', 'READY_FOR_HARVEST', 'HARVESTED'],
      default: 'PLANNED',
    },
    cropImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=600',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
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

module.exports = mongoose.model('Crop', CropSchema);
