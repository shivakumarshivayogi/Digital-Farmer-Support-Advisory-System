const Scheme = require('../models/Scheme');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Get all government schemes with search and state filter
// @route   GET /api/schemes
// @access  Public
exports.getSchemes = async (req, res, next) => {
  try {
    const { search, state, status } = req.query;
    let query = {};

    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    if (status) {
      query.status = status.toUpperCase();
    }

    if (search) {
      query.$or = [
        { schemeName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { benefits: { $regex: search, $options: 'i' } },
      ];
    }

    const schemes = await Scheme.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: schemes.length,
      schemes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single government scheme record
// @route   GET /api/schemes/:id
// @access  Public
exports.getSchemeById = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Government scheme record not found.',
      });
    }

    res.status(200).json({
      success: true,
      scheme,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new government scheme
// @route   POST /api/schemes
// @access  Private (Admin Only)
exports.createScheme = async (req, res, next) => {
  try {
    const { schemeName, description, eligibility, benefits, documentsRequired, applicationProcess, officialUrl, state, status } = req.body;

    if (!schemeName || !description || !eligibility || !benefits) {
      return res.status(400).json({
        success: false,
        message: 'Please provide schemeName, description, eligibility, and benefits.',
      });
    }

    const scheme = await Scheme.create({
      schemeName,
      description,
      eligibility,
      benefits,
      documentsRequired: documentsRequired || 'Aadhaar Card, Land Revenue Records, Bank Passbook',
      applicationProcess: applicationProcess || 'Apply online via official portal.',
      officialUrl: officialUrl || 'https://pmkisan.gov.in',
      state: state || 'All-India / National',
      status: status || 'ACTIVE',
      lastUpdated: new Date(),
    });

    // Broadcast SCHEME_UPDATE notification to farmers
    const farmers = await User.find({ role: 'farmer' }).select('_id');
    for (const farmer of farmers) {
      await createNotification({
        recipient: farmer._id,
        type: 'SCHEME_UPDATE',
        title: `New Government Scheme: ${scheme.schemeName}`,
        message: scheme.description.slice(0, 120) + '...',
        link: '/schemes',
        app: req.app,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Government scheme published successfully',
      scheme,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update government scheme
// @route   PUT /api/schemes/:id
// @access  Private (Admin Only)
exports.updateScheme = async (req, res, next) => {
  try {
    let scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Government scheme record not found.',
      });
    }

    req.body.lastUpdated = new Date();

    scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Government scheme updated successfully',
      scheme,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete government scheme
// @route   DELETE /api/schemes/:id
// @access  Private (Admin Only)
exports.deleteScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Government scheme record not found.',
      });
    }

    await scheme.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Government scheme deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
