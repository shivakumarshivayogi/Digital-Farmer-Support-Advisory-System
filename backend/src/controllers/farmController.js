const Farm = require('../models/Farm');

// @desc    Create a new farm
// @route   POST /api/farms
// @access  Private (Farmer / Admin)
exports.createFarm = async (req, res, next) => {
  try {
    const {
      farmName,
      location,
      district,
      state,
      area,
      areaUnit,
      soilType,
      irrigationType,
      waterSource,
      latitude,
      longitude,
    } = req.body;

    if (!farmName || !location || !area) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farmName, location, and area.',
      });
    }

    const farm = await Farm.create({
      farmName,
      location,
      district: district || req.user.district || '',
      state: state || req.user.state || '',
      area: Number(area),
      areaUnit: areaUnit || 'Acres',
      soilType: soilType || 'Alluvial',
      irrigationType: irrigationType || 'Borewell',
      waterSource: waterSource || 'Groundwater',
      latitude: latitude !== undefined ? Number(latitude) : null,
      longitude: longitude !== undefined ? Number(longitude) : null,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Farm registered successfully',
      farm,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all farms for logged in farmer
// @route   GET /api/farms
// @access  Private
exports.getFarms = async (req, res, next) => {
  try {
    // If admin, can retrieve all or filter by user; if farmer, get only their farms
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    
    const farms = await Farm.find(query)
      .populate('createdBy', 'name email phone role')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: farms.length,
      farms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single farm by ID
// @route   GET /api/farms/:id
// @access  Private (Owner / Admin)
exports.getFarmById = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id).populate('createdBy', 'name email phone');

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found.',
      });
    }

    // Ownership check: User can only access their own farm unless admin
    if (farm.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this farm details.',
      });
    }

    res.status(200).json({
      success: true,
      farm,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farm details
// @route   PUT /api/farms/:id
// @access  Private (Owner / Admin)
exports.updateFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found.',
      });
    }

    // Ownership check: User can only update their own farm unless admin
    if (farm.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this farm.',
      });
    }

    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Farm updated successfully',
      farm,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private (Owner / Admin)
exports.deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found.',
      });
    }

    // Ownership check: User can only delete their own farm unless admin
    if (farm.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this farm.',
      });
    }

    await farm.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Farm deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
