const express = require('express');
const {
  getMarketPrices,
  getMarketPriceById,
  createMarketPrice,
  updateMarketPrice,
  deleteMarketPrice,
} = require('../controllers/marketController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes for farmers & users
router.get('/', getMarketPrices);
router.get('/:id', getMarketPriceById);

// Admin-only management routes
router.post('/', protect, authorize('admin'), createMarketPrice);
router.put('/:id', protect, authorize('admin'), updateMarketPrice);
router.delete('/:id', protect, authorize('admin'), deleteMarketPrice);

module.exports = router;
