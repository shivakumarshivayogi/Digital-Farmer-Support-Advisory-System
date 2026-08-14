const CropAdvisory = require('../models/CropAdvisory');
const Disease = require('../models/Disease');
const Fertilizer = require('../models/Fertilizer');

// ==================== CROP ADVISORY CONTROLLERS ====================

// @desc    Get crop advisories with search filter
// @route   GET /api/advisory/crops
// @access  Public
exports.getCropAdvisories = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.cropName = { $regex: search, $options: 'i' };
    }

    const advisories = await CropAdvisory.find(query).sort('cropName');

    res.status(200).json({
      success: true,
      count: advisories.length,
      advisories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single crop advisory by ID or Name
// @route   GET /api/advisory/crops/:id
// @access  Public
exports.getCropAdvisoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let advisory;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      advisory = await CropAdvisory.findById(id);
    } else {
      advisory = await CropAdvisory.findOne({ cropName: { $regex: new RegExp(`^${id}$`, 'i') } });
    }

    if (!advisory) {
      return res.status(404).json({
        success: false,
        message: 'Crop advisory record not found.',
      });
    }

    res.status(200).json({
      success: true,
      advisory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a crop advisory entry
// @route   POST /api/advisory/crops
// @access  Private (Expert / Admin)
exports.createCropAdvisory = async (req, res, next) => {
  try {
    const advisory = await CropAdvisory.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Crop advisory created successfully',
      advisory,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== DISEASE & PEST CONTROLLERS ====================

// @desc    Get disease advisories with crop & severity filter
// @route   GET /api/advisory/diseases
// @access  Public
exports.getDiseases = async (req, res, next) => {
  try {
    const { crop, search, severity } = req.query;
    let query = {};

    if (crop) {
      query.crop = { $regex: crop, $options: 'i' };
    }

    if (severity) {
      query.severity = severity.toUpperCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { crop: { $regex: search, $options: 'i' } },
        { symptoms: { $regex: search, $options: 'i' } },
      ];
    }

    const diseases = await Disease.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: diseases.length,
      diseases,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single disease advisory
// @route   GET /api/advisory/diseases/:id
// @access  Public
exports.getDiseaseById = async (req, res, next) => {
  try {
    const disease = await Disease.findById(req.params.id);

    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease advisory not found.',
      });
    }

    res.status(200).json({
      success: true,
      disease,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create disease advisory
// @route   POST /api/advisory/diseases
// @access  Private (Expert / Admin)
exports.createDisease = async (req, res, next) => {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Disease advisory added successfully',
      disease,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== FERTILIZER CONTROLLERS ====================

// @desc    Get fertilizer advisories with crop & nutrient filter
// @route   GET /api/advisory/fertilizers
// @access  Public
exports.getFertilizers = async (req, res, next) => {
  try {
    const { crop, nutrient, search } = req.query;
    let query = {};

    if (crop) {
      query.crop = { $regex: crop, $options: 'i' };
    }

    if (nutrient) {
      query.nutrient = { $regex: nutrient, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { fertilizerName: { $regex: search, $options: 'i' } },
        { crop: { $regex: search, $options: 'i' } },
        { nutrient: { $regex: search, $options: 'i' } },
      ];
    }

    const fertilizers = await Fertilizer.find(query).sort('fertilizerName');

    res.status(200).json({
      success: true,
      count: fertilizers.length,
      fertilizers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single fertilizer advisory
// @route   GET /api/advisory/fertilizers/:id
// @access  Public
exports.getFertilizerById = async (req, res, next) => {
  try {
    const fertilizer = await Fertilizer.findById(req.params.id);

    if (!fertilizer) {
      return res.status(404).json({
        success: false,
        message: 'Fertilizer advisory record not found.',
      });
    }

    res.status(200).json({
      success: true,
      fertilizer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create fertilizer advisory
// @route   POST /api/advisory/fertilizers
// @access  Private (Expert / Admin)
exports.createFertilizer = async (req, res, next) => {
  try {
    const fertilizer = await Fertilizer.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Fertilizer advisory created successfully',
      fertilizer,
    });
  } catch (error) {
    next(error);
  }
};
