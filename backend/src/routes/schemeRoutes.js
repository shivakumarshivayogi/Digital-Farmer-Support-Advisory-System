const express = require('express');
const {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
} = require('../controllers/schemeController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes for farmers
router.get('/', getSchemes);
router.get('/:id', getSchemeById);

// Admin-only scheme management
router.post('/', protect, authorize('admin'), createScheme);
router.put('/:id', protect, authorize('admin'), updateScheme);
router.delete('/:id', protect, authorize('admin'), deleteScheme);

module.exports = router;
