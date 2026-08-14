const MarketPrice = require('../models/MarketPrice');

// @desc    Get Mandi market prices with search, crop filter, and sorting
// @route   GET /api/market
// @access  Public
exports.getMarketPrices = async (req, res, next) => {
  try {
    const { search, crop, sort } = req.query;
    let query = {};

    if (crop) {
      query.crop = { $regex: crop, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { crop: { $regex: search, $options: 'i' } },
        { market: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions = { date: -1 };
    if (sort === 'price_asc') sortOptions = { averagePrice: 1 };
    if (sort === 'price_desc') sortOptions = { averagePrice: -1 };
    if (sort === 'crop_asc') sortOptions = { crop: 1 };

    const prices = await MarketPrice.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: prices.length,
      prices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single market price record
// @route   GET /api/market/:id
// @access  Public
exports.getMarketPriceById = async (req, res, next) => {
  try {
    const price = await MarketPrice.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Market price record not found.',
      });
    }

    res.status(200).json({
      success: true,
      price,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new market price record
// @route   POST /api/market
// @access  Private (Admin Only)
exports.createMarketPrice = async (req, res, next) => {
  try {
    const { crop, market, location, minimumPrice, maximumPrice, averagePrice, date } = req.body;

    if (!crop || !market || !location || !minimumPrice || !maximumPrice || !averagePrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide crop, market, location, minimumPrice, maximumPrice, and averagePrice.',
      });
    }

    const price = await MarketPrice.create({
      crop,
      market,
      location,
      minimumPrice: Number(minimumPrice),
      maximumPrice: Number(maximumPrice),
      averagePrice: Number(averagePrice),
      date: date || new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Market commodity price published successfully',
      price,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update market price record
// @route   PUT /api/market/:id
// @access  Private (Admin Only)
exports.updateMarketPrice = async (req, res, next) => {
  try {
    let price = await MarketPrice.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Market price record not found.',
      });
    }

    price = await MarketPrice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Market commodity price updated successfully',
      price,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete market price record
// @route   DELETE /api/market/:id
// @access  Private (Admin Only)
exports.deleteMarketPrice = async (req, res, next) => {
  try {
    const price = await MarketPrice.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Market price record not found.',
      });
    }

    await price.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Market price record deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
