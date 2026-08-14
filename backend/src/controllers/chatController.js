const Message = require('../models/Message');
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Get active chat contacts/conversations list for logged-in user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // Find all messages involving logged-in user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { recipient: currentUserId }],
    })
      .sort('-createdAt')
      .populate('sender', 'name profileImage role specialization avatar')
      .populate('recipient', 'name profileImage role specialization avatar');

    const conversationMap = new Map();

    for (const msg of messages) {
      const isSender = msg.sender._id.toString() === currentUserId.toString();
      const partner = isSender ? msg.recipient : msg.sender;

      if (!partner || !partner._id) continue;
      const partnerId = partner._id.toString();

      if (!conversationMap.has(partnerId)) {
        // Count unread incoming messages from this partner
        const unreadCount = await Message.countDocuments({
          sender: partnerId,
          recipient: currentUserId,
          isRead: false,
        });

        conversationMap.set(partnerId, {
          contact: partner,
          lastMessage: msg.text || (msg.image ? '📷 Image attachment' : ''),
          lastMessageDate: msg.createdAt,
          unreadCount,
        });
      }
    }

    const conversations = Array.from(conversationMap.values());

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get message history thread with specific recipient
// @route   GET /api/chat/messages/:recipientId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { recipientId } = req.params;
    const currentUserId = req.user._id;

    const conversationId = Message.getConversationId(currentUserId, recipientId);

    // Fetch messages thread
    const messages = await Message.find({ conversationId })
      .populate('sender', 'name profileImage avatar role')
      .populate('recipient', 'name profileImage avatar role')
      .sort('createdAt');

    // Automatically mark unread incoming messages from recipient as read
    await Message.updateMany(
      {
        conversationId,
        recipient: currentUserId,
        isRead: false,
      },
      {
        $set: { isRead: true, readAt: new Date() },
      }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a chat message (text or image)
// @route   POST /api/chat/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientId, text } = req.body;
    const currentUserId = req.user._id;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Please specify recipient user ID.',
      });
    }

    if (!text && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide message text or an image attachment.',
      });
    }

    // Verify recipient user exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient user not found.',
      });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'chat');
    }

    const conversationId = Message.getConversationId(currentUserId, recipientId);

    const message = await Message.create({
      conversationId,
      sender: currentUserId,
      recipient: recipientId,
      text: text || '',
      image: imageUrl,
      isRead: false,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profileImage avatar role')
      .populate('recipient', 'name profileImage avatar role');

    // Socket.io real-time emit
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${recipientId}`).emit('receive_message', populatedMessage);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      chatMessage: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};
