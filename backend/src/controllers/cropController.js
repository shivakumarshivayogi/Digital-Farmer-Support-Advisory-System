const Crop = require('../models/Crop');
const Farm = require('../models/Farm');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Create a new crop entry
// @route   POST /api/crops
// @access  Private
exports.createCrop = async (req, res, next) => {
  try {
    const {
      cropName,
      variety,
      farmId,
      sowingDate,
      expectedHarvestDate,
      area,
      season,
      soilType,
      irrigationMethod,
      status,
      cropImage,
      notes,
    } = req.body;

    if (!cropName || !farmId || !sowingDate || !area) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cropName, farmId, sowingDate, and area.',
      });
    }

    // Verify farm plot exists and belongs to user
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
        message: 'Not authorized to add crops to this farm plot.',
      });
    }

    let imageUrl = cropImage || undefined;

    // Process uploaded file if provided via Multer
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'crops');
    }

    const crop = await Crop.create({
      cropName,
      variety: variety || '',
      farmId,
      sowingDate,
      expectedHarvestDate: expectedHarvestDate || null,
      area: Number(area),
      season: season || 'Kharif',
      soilType: soilType || farm.soilType || '',
      irrigationMethod: irrigationMethod || farm.irrigationType || '',
      status: status || 'PLANNED',
      cropImage: imageUrl,
      notes: notes || '',
      createdBy: req.user._id,
    });

    const populatedCrop = await Crop.findById(crop._id).populate('farmId', 'farmName location area');

    res.status(201).json({
      success: true,
      message: 'Crop registered successfully',
      crop: populatedCrop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all crops for logged in farmer
// @route   GET /api/crops
// @access  Private
exports.getCrops = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user._id };

    if (req.query.farmId) {
      query.farmId = req.query.farmId;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const crops = await Crop.find(query)
      .populate('farmId', 'farmName location area areaUnit district state')
      .sort('-sowingDate');

    res.status(200).json({
      success: true,
      count: crops.length,
      crops,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
// @access  Private (Owner / Admin)
exports.getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('farmId', 'farmName location area areaUnit soilType irrigationType district state')
      .populate('createdBy', 'name email phone');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop entry not found.',
      });
    }

    // Ownership check
    if (crop.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this crop entry.',
      });
    }

    res.status(200).json({
      success: true,
      crop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update crop details
// @route   PUT /api/crops/:id
// @access  Private (Owner / Admin)
exports.updateCrop = async (req, res, next) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop entry not found.',
      });
    }

    // Ownership check
    if (crop.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this crop entry.',
      });
    }

    const updateFields = { ...req.body };

    // Process new image upload if provided
    if (req.file) {
      updateFields.cropImage = await uploadToCloudinary(req.file.buffer, 'crops');
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('farmId', 'farmName location area');

    res.status(200).json({
      success: true,
      message: 'Crop updated successfully',
      crop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete crop entry
// @route   DELETE /api/crops/:id
// @access  Private (Owner / Admin)
exports.deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop entry not found.',
      });
    }

    // Ownership check
    if (crop.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this crop entry.',
      });
    }

    await crop.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Crop entry deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
