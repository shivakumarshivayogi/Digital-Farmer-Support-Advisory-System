const express = require('express');
const {
  createConsultation,
  getMyConsultations,
  updateConsultationStatus,
  rateConsultation,
} = require('../controllers/consultationController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.use(protect); // All consultation actions require authentication

router.post('/', upload.single('cropImage'), createConsultation);
router.get('/', getMyConsultations);
router.put('/:id/status', authorize('expert', 'admin'), updateConsultationStatus);
router.post('/:id/rate', rateConsultation);

module.exports = router;
