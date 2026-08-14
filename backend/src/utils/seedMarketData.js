const MarketPrice = require('../models/MarketPrice');

const seedMarketData = async () => {
  try {
    const count = await MarketPrice.countDocuments();
    if (count === 0) {
      console.log('📈 Seeding initial sample Mandi market commodity prices...');
      await MarketPrice.create([
        {
          crop: 'Wheat',
          market: 'Ludhiana Grain Market',
          location: 'Ludhiana, Punjab',
          minimumPrice: 2275,
          maximumPrice: 2450,
          averagePrice: 2380,
          date: new Date(),
        },
        {
          crop: 'Wheat',
          market: 'Karnal Grain Mandi',
          location: 'Karnal, Haryana',
          minimumPrice: 2250,
          maximumPrice: 2420,
          averagePrice: 2350,
          date: new Date(),
        },
        {
          crop: 'Paddy Rice (Basmati)',
          market: 'Amritsar Grain Mandi',
          location: 'Amritsar, Punjab',
          minimumPrice: 3800,
          maximumPrice: 4350,
          averagePrice: 4120,
          date: new Date(),
        },
        {
          crop: 'Paddy Rice (Basmati)',
          market: 'Karnal Grain Mandi',
          location: 'Karnal, Haryana',
          minimumPrice: 3750,
          maximumPrice: 4280,
          averagePrice: 4050,
          date: new Date(),
        },
        {
          crop: 'Cotton (Long Staple)',
          market: 'Bhatinda Cotton Market',
          location: 'Bhatinda, Punjab',
          minimumPrice: 6800,
          maximumPrice: 7450,
          averagePrice: 7180,
          date: new Date(),
        },
        {
          crop: 'Cotton (Long Staple)',
          market: 'Sirsa Cotton Market',
          location: 'Sirsa, Haryana',
          minimumPrice: 6750,
          maximumPrice: 7380,
          averagePrice: 7100,
          date: new Date(),
        },
        {
          crop: 'Tomato',
          market: 'Azadpur Wholesale Mandi',
          location: 'New Delhi, Delhi',
          minimumPrice: 1400,
          maximumPrice: 2200,
          averagePrice: 1850,
          date: new Date(),
        },
        {
          crop: 'Tomato',
          market: 'Vashi APMC Market',
          location: 'Navi Mumbai, Maharashtra',
          minimumPrice: 1500,
          maximumPrice: 2350,
          averagePrice: 1920,
          date: new Date(),
        },
        {
          crop: 'Sugarcane',
          market: 'Muzaffarnagar Mandi',
          location: 'Muzaffarnagar, Uttar Pradesh',
          minimumPrice: 340,
          maximumPrice: 370,
          averagePrice: 355,
          date: new Date(),
        },
        {
          crop: 'Potato',
          market: 'Agra Vegetable Market',
          location: 'Agra, Uttar Pradesh',
          minimumPrice: 1100,
          maximumPrice: 1550,
          averagePrice: 1350,
          date: new Date(),
        },
      ]);
    }
  } catch (error) {
    console.error('Error seeding market price data:', error.message);
  }
};

module.exports = seedMarketData;
