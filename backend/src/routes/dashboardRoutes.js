const express = require('express');
const {
  getFarmerDashboard,
  getExpertDashboard,
  getAdminDashboard,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All dashboard endpoints require authentication

router.get('/farmer', authorize('farmer', 'admin'), getFarmerDashboard);
router.get('/expert', authorize('expert', 'admin'), getExpertDashboard);
router.get('/admin', authorize('admin'), getAdminDashboard);

module.exports = router;
