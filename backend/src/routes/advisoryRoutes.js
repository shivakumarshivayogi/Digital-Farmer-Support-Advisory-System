const express = require('express');
const {
  getCropAdvisories,
  getCropAdvisoryById,
  createCropAdvisory,
  getDiseases,
  getDiseaseById,
  createDisease,
  getFertilizers,
  getFertilizerById,
  createFertilizer,
} = require('../controllers/advisoryController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Crop Advisory Routes
router.get('/crops', getCropAdvisories);
router.get('/crops/:id', getCropAdvisoryById);
router.post('/crops', protect, authorize('expert', 'admin'), createCropAdvisory);

// Disease Advisory Routes
router.get('/diseases', getDiseases);
router.get('/diseases/:id', getDiseaseById);
router.post('/diseases', protect, authorize('expert', 'admin'), createDisease);

// Fertilizer Advisory Routes
router.get('/fertilizers', getFertilizers);
router.get('/fertilizers/:id', getFertilizerById);
router.post('/fertilizers', protect, authorize('expert', 'admin'), createFertilizer);

module.exports = router;
