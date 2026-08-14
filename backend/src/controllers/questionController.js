const Question = require('../models/Question');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Post a crop question with image
// @route   POST /api/questions
// @access  Private (Farmer / Admin)
exports.createQuestion = async (req, res, next) => {
  try {
    const { title, crop, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide question title and details.',
      });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'questions');
    }

    const question = await Question.create({
      farmerId: req.user._id,
      title,
      crop: crop || 'General',
      description,
      image: imageUrl,
      status: 'PENDING',
    });

    const populatedQuestion = await Question.findById(question._id).populate('farmerId', 'name profileImage district state');

    res.status(201).json({
      success: true,
      message: 'Question posted successfully to Advisory Forum',
      question: populatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Q&A questions with search and crop filter
// @route   GET /api/questions
// @access  Public
exports.getQuestions = async (req, res, next) => {
  try {
    const { crop, search, status } = req.query;
    let query = {};

    if (crop) {
      query.crop = { $regex: crop, $options: 'i' };
    }

    if (status) {
      query.status = status.toUpperCase();
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { crop: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const questions = await Question.find(query)
      .populate('farmerId', 'name profileImage district state')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('farmerId', 'name profileImage district state')
      .populate('answers.expertId', 'name profileImage specialization qualification');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit an expert diagnostic answer to a question
// @route   POST /api/questions/:id/answer
// @access  Private (Expert / Admin Only)
exports.answerQuestion = async (req, res, next) => {
  try {
    const { answerText } = req.body;

    if (!answerText) {
      return res.status(400).json({
        success: false,
        message: 'Please provide diagnostic answer text.',
      });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    question.answers.push({
      expertId: req.user._id,
      expertName: req.user.name,
      expertSpecialization: req.user.specialization || 'Agriculture Expert',
      answerText,
      createdAt: new Date(),
    });

    question.status = 'ANSWERED';
    await question.save();

    // Trigger EXPERT_ANSWER notification for farmer
    const { createNotification } = require('./notificationController');
    await createNotification({
      recipient: question.farmerId,
      type: 'EXPERT_ANSWER',
      title: `Expert Diagnostic Answer Received`,
      message: `${req.user.name} answered your question regarding ${question.crop}: "${question.title.slice(0, 50)}..."`,
      link: `/questions/${question._id}`,
      app: req.app,
    });

    const updatedQuestion = await Question.findById(question._id)
      .populate('farmerId', 'name profileImage')
      .populate('answers.expertId', 'name profileImage specialization qualification');

    res.status(200).json({
      success: true,
      message: 'Expert answer submitted successfully',
      question: updatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};
