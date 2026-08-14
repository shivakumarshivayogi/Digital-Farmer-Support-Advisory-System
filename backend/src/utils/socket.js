const onlineUsers = new Map(); // userId -> socketId

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('⚡ Socket connected:', socket.id);

    // User setup & room join
    socket.on('setup', (userId) => {
      if (!userId) return;
      socket.userId = userId;
      socket.join(`user_${userId}`);
      onlineUsers.set(userId, socket.id);

      console.log(`👤 User ${userId} joined room user_${userId}`);

      // Broadcast online status & list of online user IDs
      io.emit('online_users', Array.from(onlineUsers.keys()));
    });

    // Join specific chat thread
    socket.on('join_chat', (room) => {
      socket.join(room);
    });

    // Real-time message dispatch
    socket.on('send_message', (messageData) => {
      if (!messageData || !messageData.recipient) return;

      const recipientId = typeof messageData.recipient === 'object' ? messageData.recipient._id : messageData.recipient;

      // Emit to recipient's room
      io.to(`user_${recipientId}`).emit('receive_message', messageData);
    });

    // Real-time typing indicators
    socket.on('typing', ({ recipientId, senderId }) => {
      io.to(`user_${recipientId}`).emit('typing', { senderId });
    });

    socket.on('stop_typing', ({ recipientId, senderId }) => {
      io.to(`user_${recipientId}`).emit('stop_typing', { senderId });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('⚡ Socket disconnected:', socket.id);
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('online_users', Array.from(onlineUsers.keys()));
      }
    });
  });
};

module.exports = { initializeSocket, onlineUsers };
