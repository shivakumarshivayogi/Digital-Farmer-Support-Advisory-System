const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Disease = require('../models/Disease');
const MarketPrice = require('../models/MarketPrice');
const Question = require('../models/Question');
const Consultation = require('../models/Consultation');
const Scheme = require('../models/Scheme');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get aggregated dashboard stats for Farmer
// @route   GET /api/dashboard/farmer
// @access  Private (Farmer / Admin)
exports.getFarmerDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      totalFarms,
      totalCrops,
      activeCrops,
      diseaseAlerts,
      marketPrices,
      recentQuestions,
      unreadNotifications,
    ] = await Promise.all([
      Farm.countDocuments({ createdBy: userId }),
      Crop.countDocuments({ createdBy: userId }),
      Crop.countDocuments({
        createdBy: userId,
        status: { $in: ['SOWN', 'GROWING', 'READY_FOR_HARVEST'] },
      }),
      Disease.find().sort('-createdAt').limit(3),
      MarketPrice.find().sort('-createdAt').limit(4),
      Question.find({ farmerId: userId }).sort('-createdAt').limit(3),
      Notification.countDocuments({ recipient: userId, isRead: false }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalFarms,
        totalCrops,
        activeCrops,
        diseaseAlerts,
        marketPrices,
        recentQuestions,
        unreadNotifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregated dashboard stats for Agriculture Expert
// @route   GET /api/dashboard/expert
// @access  Private (Expert / Admin)
exports.getExpertDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      totalQuestions,
      pendingQuestions,
      answeredQuestions,
      totalConsultations,
      pendingConsultations,
      unansweredList,
      recentConsultations,
    ] = await Promise.all([
      Question.countDocuments(),
      Question.countDocuments({ status: 'PENDING' }),
      Question.countDocuments({ status: 'ANSWERED' }),
      Consultation.countDocuments({ expertId: userId }),
      Consultation.countDocuments({ expertId: userId, status: 'PENDING' }),
      Question.find({ status: 'PENDING' }).populate('farmerId', 'name profileImage district state').sort('-createdAt').limit(5),
      Consultation.find({ expertId: userId }).populate('farmerId', 'name profileImage district state').sort('-createdAt').limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalQuestions,
        pendingQuestions,
        answeredQuestions,
        totalConsultations,
        pendingConsultations,
        rating: req.user.rating || 5.0,
        ratingCount: req.user.ratingCount || 0,
        unansweredList,
        recentConsultations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregated executive dashboard stats for Admin
// @route   GET /api/dashboard/admin
// @access  Private (Admin Only)
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalFarmers,
      totalExperts,
      totalCrops,
      totalQuestions,
      totalConsultations,
      totalSchemes,
      cropsByStatus,
      consultationsByStatus,
      questionsByStatus,
    ] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'expert' }),
      Crop.countDocuments(),
      Question.countDocuments(),
      Consultation.countDocuments(),
      Scheme.countDocuments(),
      Crop.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Consultation.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Question.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalFarmers,
        totalExperts,
        totalCrops,
        totalQuestions,
        totalConsultations,
        totalSchemes,
        analytics: {
          cropsByStatus,
          consultationsByStatus,
          questionsByStatus,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
