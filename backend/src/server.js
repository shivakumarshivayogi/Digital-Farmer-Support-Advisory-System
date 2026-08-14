const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const seedAdvisoryData = require('./utils/seedAdvisoryData');
const seedMarketData = require('./utils/seedMarketData');
const seedExpertData = require('./utils/seedExpertData');
const seedSchemeData = require('./utils/seedSchemeData');
const { initializeSocket } = require('./utils/socket');
const errorHandler = require('./middlewares/error');

const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const cropRoutes = require('./routes/cropRoutes');
const advisoryRoutes = require('./routes/advisoryRoutes');
const soilRoutes = require('./routes/soilRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const marketRoutes = require('./routes/marketRoutes');
const expertRoutes = require('./routes/expertRoutes');
const questionRoutes = require('./routes/questionRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Connect to MongoDB & seed sample advisory/market/expert/scheme data
connectDB().then(() => {
  seedAdvisoryData();
  seedMarketData();
  seedExpertData();
  seedSchemeData();
});

const app = express();
const server = http.createServer(app);

// Enable Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline styles & icons for Vite dev
}));

// Enable API Rate Limiting (200 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// Enable Socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Initialize Socket.io real-time handlers
initializeSocket(io);
app.set('io', io);

// Middleware setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Digital Farmer Support System API active',
    timestamp: new Date(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/soil-records', soilRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Mount Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌾 Digital Farmer Support Server running on port ${PORT}`);
  console.log(`🛡️ Helmet HTTP Security Headers active`);
  console.log(`⏱️ Express Rate Limiter active at /api/*`);
  console.log(`🔑 Auth Endpoints active at /api/auth/*`);
  console.log(`🚜 Farm Endpoints active at /api/farms/*`);
  console.log(`🌱 Crop Endpoints active at /api/crops/*`);
  console.log(`📚 Advisory Endpoints active at /api/advisory/*`);
  console.log(`🧪 Soil Records active at /api/soil-records/*`);
  console.log(`🌤️ Weather Proxy active at /api/weather`);
  console.log(`📈 Market Prices active at /api/market/*`);
  console.log(`🎓 Expert Profiles active at /api/experts/*`);
  console.log(`❓ Q&A Questions active at /api/questions/*`);
  console.log(`💬 Consultations active at /api/consultations/*`);
  console.log(`⚡ Real-Time Chat active at /api/chat/* & Socket.io`);
  console.log(`🏛️ Govt Schemes active at /api/schemes/*`);
  console.log(`🔔 Notifications active at /api/notifications/*`);
  console.log(`📊 Dashboards active at /api/dashboard/*`);
  console.log(`====================================================`);
});
