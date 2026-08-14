const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please state your question title'],
      trim: true,
    },
    crop: {
      type: String,
      default: 'General',
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide question details'],
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ANSWERED', 'CLOSED'],
      default: 'PENDING',
    },
    answers: [
      {
        expertId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        expertName: String,
        expertSpecialization: String,
        answerText: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', QuestionSchema);
