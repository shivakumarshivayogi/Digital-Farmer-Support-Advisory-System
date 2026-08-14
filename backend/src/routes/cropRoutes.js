const express = require('express');
const {
  createCrop,
  getCrops,
  getCropById,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.use(protect); // All crop routes require authentication

router.route('/')
  .post(upload.single('cropImage'), createCrop)
  .get(getCrops);

router.route('/:id')
  .get(getCropById)
  .put(upload.single('cropImage'), updateCrop)
  .delete(deleteCrop);

module.exports = router;
