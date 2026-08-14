const SoilRecord = require('../models/SoilRecord');
const Farm = require('../models/Farm');

// @desc    Create a soil test record
// @route   POST /api/soil-records
// @access  Private
exports.createSoilRecord = async (req, res, next) => {
  try {
    const {
      farmId,
      soilType,
      ph,
      nitrogen,
      phosphorus,
      potassium,
      organicCarbon,
      moisture,
      testingDate,
    } = req.body;

    if (!farmId || ph === undefined || nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farmId, ph, nitrogen, phosphorus, and potassium levels.',
      });
    }

    // Verify farm plot belongs to user
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Selected farm plot not found.',
      });
    }

    if (farm.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to record soil tests for this farm plot.',
      });
    }

    const record = await SoilRecord.create({
      farmId,
      soilType: soilType || farm.soilType || 'Alluvial',
      ph: Number(ph),
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      organicCarbon: organicCarbon !== undefined ? Number(organicCarbon) : 0.5,
      moisture: moisture !== undefined ? Number(moisture) : 20,
      testingDate: testingDate || Date.now(),
      createdBy: req.user._id,
    });

    const populatedRecord = await SoilRecord.findById(record._id).populate('farmId', 'farmName location area');

    res.status(201).json({
      success: true,
      message: 'Soil test record saved successfully',
      soilRecord: populatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all soil test records for logged in farmer
// @route   GET /api/soil-records
// @access  Private
exports.getSoilRecords = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user._id };

    if (req.query.farmId) {
      query.farmId = req.query.farmId;
    }

    const records = await SoilRecord.find(query)
      .populate('farmId', 'farmName location district state area')
      .sort('-testingDate');

    res.status(200).json({
      success: true,
      count: records.length,
      soilRecords: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single soil record by ID
// @route   GET /api/soil-records/:id
// @access  Private (Owner / Admin)
exports.getSoilRecordById = async (req, res, next) => {
  try {
    const record = await SoilRecord.findById(req.params.id).populate('farmId', 'farmName location district state');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Soil test record not found.',
      });
    }

    // Ownership check
    if (record.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this soil test record.',
      });
    }

    res.status(200).json({
      success: true,
      soilRecord: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete soil record
// @route   DELETE /api/soil-records/:id
// @access  Private (Owner / Admin)
exports.deleteSoilRecord = async (req, res, next) => {
  try {
    const record = await SoilRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Soil test record not found.',
      });
    }

    // Ownership check
    if (record.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this soil test record.',
      });
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Soil test record deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
