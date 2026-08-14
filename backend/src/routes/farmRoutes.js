const express = require('express');
const {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
} = require('../controllers/farmController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All farm routes require authentication

router.route('/')
  .post(createFarm)
  .get(getFarms);

router.route('/:id')
  .get(getFarmById)
  .put(updateFarm)
  .delete(deleteFarm);

module.exports = router;
