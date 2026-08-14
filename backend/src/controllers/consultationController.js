const Consultation = require('../models/Consultation');
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Request a 1-on-1 consultation with an Agriculture Expert
// @route   POST /api/consultations
// @access  Private (Farmer / Admin)
exports.createConsultation = async (req, res, next) => {
  try {
    const { expertId, subject, description } = req.body;

    if (!expertId || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide target expertId, subject, and description.',
      });
    }

    // Verify target expert exists
    const expert = await User.findOne({ _id: expertId, role: 'expert' });
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Selected Agriculture Expert not found.',
      });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'consultations');
    }

    const consultation = await Consultation.create({
      farmerId: req.user._id,
      expertId,
      subject,
      description,
      cropImage: imageUrl,
      status: 'PENDING',
    });

    const populatedConsultation = await Consultation.findById(consultation._id)
      .populate('farmerId', 'name email phone profileImage district state')
      .populate('expertId', 'name email specialization qualification profileImage rating');

    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully',
      consultation: populatedConsultation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's consultations (as farmer or expert)
// @route   GET /api/consultations
// @access  Private
exports.getMyConsultations = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'expert') {
      query.expertId = req.user._id;
    } else if (req.user.role === 'farmer') {
      query.farmerId = req.user._id;
    } else {
      // Admin sees all consultations
      query = {};
    }

    if (req.query.status) {
      query.status = req.query.status.toUpperCase();
    }

    const consultations = await Consultation.find(query)
      .populate('farmerId', 'name email phone profileImage district state')
      .populate('expertId', 'name email specialization qualification profileImage rating consultationFee')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update consultation status & notes by Expert
// @route   PUT /api/consultations/:id/status
// @access  Private (Expert / Admin Only)
exports.updateConsultationStatus = async (req, res, next) => {
  try {
    const { status, expertNotes } = req.body;

    if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be ACCEPTED, REJECTED, or COMPLETED.',
      });
    }

    let consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation request not found.',
      });
    }

    // Verify expert ownership
    if (consultation.expertId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this consultation request.',
      });
    }

    consultation.status = status;
    if (expertNotes) consultation.expertNotes = expertNotes;

    await consultation.save();

    // Trigger CONSULTATION_UPDATE notification for farmer
    const { createNotification } = require('./notificationController');
    await createNotification({
      recipient: consultation.farmerId,
      type: 'CONSULTATION_UPDATE',
      title: `Consultation Status Updated (${status})`,
      message: `Dr. ${req.user.name} updated consultation status to ${status} for: "${consultation.subject.slice(0, 40)}..."`,
      link: `/consultations`,
      app: req.app,
    });

    const updatedConsultation = await Consultation.findById(consultation._id)
      .populate('farmerId', 'name email phone profileImage')
      .populate('expertId', 'name specialization profileImage');

    res.status(200).json({
      success: true,
      message: `Consultation status updated to ${status}`,
      consultation: updatedConsultation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate & review an Expert after completed consultation
// @route   POST /api/consultations/:id/rate
// @access  Private (Farmer / Admin)
exports.rateConsultation = async (req, res, next) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a star rating between 1 and 5.',
      });
    }

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found.',
      });
    }

    if (consultation.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this consultation.',
      });
    }

    if (consultation.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Consultations can only be rated once marked COMPLETED.',
      });
    }

    consultation.rating = Number(rating);
    consultation.review = review || '';
    await consultation.save();

    // Dynamically recalculate expert's overall average rating
    const expertId = consultation.expertId;
    const completedRatings = await Consultation.find({
      expertId,
      rating: { $exists: true, $ne: null },
    });

    if (completedRatings.length > 0) {
      const avgRating =
        completedRatings.reduce((acc, c) => acc + c.rating, 0) / completedRatings.length;

      await User.findByIdAndUpdate(expertId, {
        rating: Number(avgRating.toFixed(2)),
        ratingCount: completedRatings.length,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expert rating and review submitted successfully',
      consultation,
    });
  } catch (error) {
    next(error);
  }
};
