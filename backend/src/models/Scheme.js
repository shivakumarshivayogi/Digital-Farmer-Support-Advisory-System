const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema(
  {
    schemeName: {
      type: String,
      required: [true, 'Please provide scheme name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide scheme description'],
    },
    eligibility: {
      type: String,
      required: [true, 'Please state eligibility criteria'],
    },
    benefits: {
      type: String,
      required: [true, 'Please outline scheme benefits'],
    },
    documentsRequired: {
      type: String,
      default: 'Aadhaar Card, Land Revenue Records, Bank Passbook, Passport Photograph',
    },
    applicationProcess: {
      type: String,
      default: 'Apply online through the official portal or visit the nearest Common Service Centre (CSC) / District Agriculture Office.',
    },
    officialUrl: {
      type: String,
      default: 'https://pmkisan.gov.in',
    },
    state: {
      type: String,
      default: 'All-India / National',
      trim: true,
      index: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Scheme', SchemeSchema);
