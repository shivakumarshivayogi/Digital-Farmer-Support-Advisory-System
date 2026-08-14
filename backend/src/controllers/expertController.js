const User = require('../models/User');

// @desc    Get all certified experts with search & specialization filter
// @route   GET /api/experts
// @access  Public
exports.getExperts = async (req, res, next) => {
  try {
    const { search, specialization, minRating } = req.query;
    let query = { role: 'expert' };

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } },
      ];
    }

    const experts = await User.find(query).select('-password').sort('-rating');

    res.status(200).json({
      success: true,
      count: experts.length,
      experts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expert profile
// @route   GET /api/experts/:id
// @access  Public
exports.getExpertById = async (req, res, next) => {
  try {
    const expert = await User.findOne({ _id: req.params.id, role: 'expert' }).select('-password');

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      expert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged in expert profile details
// @route   PUT /api/experts/profile
// @access  Private (Expert Only)
exports.updateExpertProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      specialization: req.body.specialization,
      experience: req.body.experience,
      qualification: req.body.qualification,
      bio: req.body.bio,
      consultationFee: req.body.consultationFee,
      availableForConsultation: req.body.availableForConsultation,
    };

    const expert = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Expert profile updated successfully',
      expert,
    });
  } catch (error) {
    next(error);
  }
};
