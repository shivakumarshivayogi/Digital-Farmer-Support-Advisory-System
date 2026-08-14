const mongoose = require('mongoose');

const MarketPriceSchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: [true, 'Please specify crop name'],
      trim: true,
      index: true,
    },
    market: {
      type: String,
      required: [true, 'Please specify Mandi or Market name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please specify market location/district'],
      trim: true,
    },
    minimumPrice: {
      type: Number,
      required: [true, 'Please specify minimum price (₹/quintal)'],
      min: 0,
    },
    maximumPrice: {
      type: Number,
      required: [true, 'Please specify maximum price (₹/quintal)'],
      min: 0,
    },
    averagePrice: {
      type: Number,
      required: [true, 'Please specify average price (₹/quintal)'],
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);
