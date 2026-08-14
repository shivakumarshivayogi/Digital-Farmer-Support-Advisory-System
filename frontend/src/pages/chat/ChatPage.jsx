import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import {
  MessageSquare,
  Send,
  Upload,
  Search,
  Check,
  CheckCheck,
  Loader2,
  User,
  Award,
  Image as ImageIcon,
  Circle,
  Plus,
} from 'lucide-react';

const ChatPage = () => {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [availableContacts, setAvailableContacts] = useState([]);

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversations contact list
  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const res = await api.get('/chat/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Fetch thread messages with recipient
  const fetchMessages = async (targetId) => {
    if (!targetId) return;
    setLoadingMessages(true);
    try {
      const res = await api.get(`/chat/messages/${targetId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to load thread messages', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Fetch candidate list for starting a new chat
  const fetchAvailableContacts = async () => {
    try {
      if (user?.role === 'farmer') {
        const res = await api.get('/experts');
        if (res.data.success) setAvailableContacts(res.data.experts);
      } else {
        // Experts can chat with any registered farmer
        const res = await api.get('/chat/conversations');
        if (res.data.success) setAvailableContacts(res.data.conversations.map((c) => c.contact));
      }
    } catch (err) {
      console.error('Failed to fetch available contacts', err);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchAvailableContacts();
  }, []);

  useEffect(() => {
    if (recipientId) {
      // Find contact details from conversations or fetch
      const foundConv = conversations.find((c) => c.contact?._id === recipientId);
      if (foundConv) {
        setActiveContact(foundConv.contact);
      } else {
        // Fetch user info for target recipientId
        api.get(`/experts/${recipientId}`).then((res) => {
          if (res.data.success) setActiveContact(res.data.expert);
        }).catch(() => {});
      }
      fetchMessages(recipientId);
    }
  }, [recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time Socket.io listener for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msgData) => {
      const senderId = typeof msgData.sender === 'object' ? msgData.sender._id : msgData.sender;

      // If active conversation matches sender, append message to stream
      if (activeContact && (senderId === activeContact._id || msgData.recipient === activeContact._id)) {
        setMessages((prev) => [...prev, msgData]);
        scrollToBottom();
      }

      // Refresh conversations list to update last message & unread badge
      fetchConversations();
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, activeContact]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeContact || (!textInput.trim() && !imageFile)) return;

    setSending(true);
    try {
      const formData = new FormData();
      formData.append('recipientId', activeContact._id);
      formData.append('text', textInput);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await api.post('/chat/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const newMsg = res.data.chatMessage;
        setMessages((prev) => [...prev, newMsg]);

        // Emit live socket event to recipient
        if (socket) {
          socket.emit('send_message', newMsg);
        }

        setTextInput('');
        setImageFile(null);
        setImagePreview(null);
        fetchConversations();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-5rem)] flex flex-col">
      <div className="glass-card rounded-3xl border border-slate-800 flex-1 flex overflow-hidden shadow-2xl">
        {/* Left Sidebar - Contacts List */}
        <div className={`w-full md:w-80 border-r border-slate-800 flex flex-col ${recipientId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Conversations
            </h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
              title="Start New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {loadingConversations ? (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                <span className="text-xs">Loading chat contacts...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <p>No active chat conversations.</p>
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="px-3 py-1.5 bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Start New Chat
                </button>
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = activeContact?._id === conv.contact?._id;
                const online = isUserOnline(conv.contact?._id);

                return (
                  <div
                    key={conv.contact?._id}
                    onClick={() => {
                      setActiveContact(conv.contact);
                      navigate(`/chat/${conv.contact?._id}`);
                    }}
                    className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-slate-800/40 ${
                      isSelected ? 'bg-slate-800/80 border-l-4 border-emerald-400' : ''
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.contact?.profileImage || conv.contact?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
                        alt={conv.contact?.name}
                        className="w-11 h-11 rounded-full border border-slate-700 object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                          online ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                      ></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{conv.contact?.name}</h4>
                        <span className="text-[10px] text-slate-500">
                          {new Date(conv.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Chat Window */}
        <div className={`flex-1 flex flex-col ${!recipientId ? 'hidden md:flex' : 'flex'}`}>
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/chat')}
                    className="md:hidden p-1 text-slate-400 hover:text-white"
                  >
                    ←
                  </button>
                  <div className="relative">
                    <img
                      src={activeContact.profileImage || activeContact.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
                      alt={activeContact.name}
                      className="w-10 h-10 rounded-full border border-emerald-500/40 object-cover"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                        isUserOnline(activeContact._id) ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}
                    ></span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeContact.name}</h3>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      {isUserOnline(activeContact._id) ? 'Online Now' : 'Offline'}
                      {activeContact.specialization ? ` • ${activeContact.specialization}` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/40">
                {loadingMessages ? (
                  <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                    <span className="text-xs">Loading message thread...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-16 text-center text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-white">No messages yet with {activeContact.name}.</p>
                    <p>Send a message below to start conversation.</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                    const isMe = senderId.toString() === user._id.toString();

                    return (
                      <div
                        key={msg._id || idx}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs space-y-2 shadow-lg ${
                            isMe
                              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-br-none'
                              : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'
                          }`}
                        >
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="Shared attachment"
                              className="rounded-xl max-h-60 w-full object-cover border border-slate-700/50"
                            />
                          )}
                          {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                          <div className="flex items-center justify-end gap-1 text-[10px] opacity-75 pt-0.5">
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && (
                              <span>
                                {msg.isRead ? <CheckCheck className="w-3 h-3 text-sky-300" /> : <Check className="w-3 h-3" />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
                {imagePreview && (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-emerald-500/40" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label className="p-2.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors">
                    <ImageIcon className="w-5 h-5" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>

                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={`Message ${activeContact.name}...`}
                    className="flex-1 py-2.5 px-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />

                  <button
                    type="submit"
                    disabled={sending || (!textInput.trim() && !imageFile)}
                    className="p-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-600" />
              <h3 className="text-base font-bold text-white">Select a Conversation</h3>
              <p className="text-xs max-w-sm">Choose a contact from the sidebar or start a new chat with an Agriculture Expert.</p>
            </div>
          )}
        </div>
      </div>

      {/* Start New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" /> Start New Live Chat
              </h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto divide-y divide-slate-800">
              {availableContacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => {
                    setActiveContact(contact);
                    navigate(`/chat/${contact._id}`);
                    setShowNewChatModal(false);
                  }}
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-800/60 rounded-xl transition-colors"
                >
                  <img
                    src={contact.profileImage || contact.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full border border-emerald-500/40 object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{contact.name}</h4>
                    <span className="text-[10px] text-amber-400 font-medium">{contact.specialization || contact.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
