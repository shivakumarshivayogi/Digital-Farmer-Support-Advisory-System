const mongoose = require('mongoose');

const SoilRecordSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: [true, 'Please select a farm plot'],
      index: true,
    },
    soilType: {
      type: String,
      default: 'Alluvial',
      trim: true,
    },
    ph: {
      type: Number,
      required: [true, 'Please specify soil pH level'],
      min: 0,
      max: 14,
    },
    nitrogen: {
      type: Number,
      required: [true, 'Please specify Nitrogen (N) content in kg/ha'],
    },
    phosphorus: {
      type: Number,
      required: [true, 'Please specify Phosphorus (P) content in kg/ha'],
    },
    potassium: {
      type: Number,
      required: [true, 'Please specify Potassium (K) content in kg/ha'],
    },
    organicCarbon: {
      type: Number,
      default: 0.5,
    },
    moisture: {
      type: Number,
      default: 20,
    },
    testingDate: {
      type: Date,
      default: Date.now,
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

module.exports = mongoose.model('SoilRecord', SoilRecordSchema);
