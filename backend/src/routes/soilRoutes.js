const express = require('express');
const {
  createSoilRecord,
  getSoilRecords,
  getSoilRecordById,
  deleteSoilRecord,
} = require('../controllers/soilController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // Soil health testing requires authentication

router.route('/')
  .post(createSoilRecord)
  .get(getSoilRecords);

router.route('/:id')
  .get(getSoilRecordById)
  .delete(deleteSoilRecord);

module.exports = router;
