const express = require('express');
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  answerQuestion,
} = require('../controllers/questionController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', protect, upload.single('image'), createQuestion);
router.post('/:id/answer', protect, authorize('expert', 'admin'), answerQuestion);

module.exports = router;
