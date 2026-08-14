const express = require('express');
const {
  getConversations,
  getMessages,
  sendMessage,
} = require('../controllers/chatController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.use(protect); // All chat operations require authentication

router.get('/conversations', getConversations);
router.get('/messages/:recipientId', getMessages);
router.post('/messages', upload.single('image'), sendMessage);

module.exports = router;
