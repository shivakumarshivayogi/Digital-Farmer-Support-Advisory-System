const express = require('express');
const { getExperts, getExpertById, updateExpertProfile } = require('../controllers/expertController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getExperts);
router.get('/:id', getExpertById);
router.put('/profile', protect, authorize('expert'), updateExpertProfile);

module.exports = router;
