const CropAdvisory = require('../models/CropAdvisory');
const Disease = require('../models/Disease');
const Fertilizer = require('../models/Fertilizer');

const seedAdvisoryData = async () => {
  try {
    const cropCount = await CropAdvisory.countDocuments();
    if (cropCount === 0) {
      console.log('🌱 Seeding initial sample crop advisories...');
      await CropAdvisory.create([
        {
          cropName: 'Wheat',
          suitableSoil: 'Well-drained fertile clay loam or alluvial soil with pH 6.0 - 7.5',
          growingConditions: 'Cool winter climate during growth (15-25°C) and warm sunny weather during ripening.',
          waterRequirements: '4-6 irrigations at critical growth stages (Crown Root Initiation, Tillering, Flowering, Grain filling).',
          sowingInfo: 'Optimum sowing time: November 1 - November 15. Seed rate: 40 kg per acre.',
          growthDuration: '120 - 140 days',
          commonDiseases: ['Yellow Rust', 'Loose Smut', 'Karnal Bunt'],
          pestInfo: 'Aphids, Termites, Armyworms during vegetative and heading stages.',
          preventionGuidance: 'Use disease-resistant certified seeds (HD-2967, PBW-550), treat seeds with Trichoderma viride, avoid waterlogging.',
          image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=600',
        },
        {
          cropName: 'Paddy Rice',
          suitableSoil: 'Clay or clay loam soils capable of holding standing water with pH 5.5 - 6.5',
          growingConditions: 'Hot and humid climate (20-35°C) with abundant sunshine.',
          waterRequirements: 'High water requirement. Maintain 2-5 cm standing water during tillering to panicle initiation.',
          sowingInfo: 'Nursery preparation: May-June. Transplanting 25-30 days old seedlings.',
          growthDuration: '110 - 150 days',
          commonDiseases: ['Rice Blast', 'Bacterial Leaf Blight', 'Sheath Blight'],
          pestInfo: 'Stem Borer, Brown Planthopper (BPH), Leaf Folder.',
          preventionGuidance: 'Adopt System of Rice Intensification (SRI), balanced NPK application, avoid excess Nitrogen.',
          image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=600',
        },
        {
          cropName: 'Cotton',
          suitableSoil: 'Deep black cotton soil (Regur) or well-drained alluvial soil with pH 6.0 - 8.0',
          growingConditions: 'Warm sunny weather (21-30°C) with at least 180-200 frost-free days.',
          waterRequirements: 'Moderate irrigation (600-800 mm). Avoid heavy waterlogging during flowering.',
          sowingInfo: 'Sowing in April - May with 90x60 cm spacing.',
          growthDuration: '160 - 180 days',
          commonDiseases: ['Cotton Leaf Curl Virus', 'Fusarium Wilt', 'Root Rot'],
          pestInfo: 'Pink Bollworm, Whitefly, Jassids, Thrips.',
          preventionGuidance: 'Install Yellow Sticky Traps, spray neem oil (10000 ppm), plant refuge lines around Bt Cotton.',
          image: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&q=80&w=600',
        },
        {
          cropName: 'Tomato',
          suitableSoil: 'Well-drained sandy loam or loam soil rich in organic matter (pH 6.0 - 7.0)',
          growingConditions: 'Warm climate (20-27°C). Sensitive to frost and extreme heat above 38°C.',
          waterRequirements: 'Drip irrigation recommended. Water at 3-5 day intervals avoiding leaf wetting.',
          sowingInfo: 'Seedling transplanting after 30 days of nursery sowing.',
          growthDuration: '90 - 120 days',
          commonDiseases: ['Early Blight', 'Late Blight', 'Tomato Leaf Curl Virus'],
          pestInfo: 'Fruit Borer (Helicoverpa armigera), Whitefly, Leaf Miner.',
          preventionGuidance: 'Mulching with silver-black film, install Pheromone traps (4/acre), staking for vine support.',
          image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb247a5?auto=format&fit=crop&q=80&w=600',
        },
      ]);
    }

    const diseaseCount = await Disease.countDocuments();
    if (diseaseCount === 0) {
      console.log('🦠 Seeding initial sample disease advisories...');
      await Disease.create([
        {
          name: 'Yellow Rust (Stripe Rust)',
          crop: 'Wheat',
          symptoms: 'Yellow pustules arranged in linear stripes on upper surface of leaves.',
          causes: 'Fungal pathogen Puccinia striiformis favored by cool temperatures (10-15°C) and high humidity.',
          prevention: 'Grow resistant varieties like HD-2967, PBW-725. Avoid excessive Nitrogen fertilizer.',
          management: 'Foliar spray of Propiconazole 25% EC @ 1 ml/liter of water at first appearance of symptoms.',
          severity: 'HIGH',
          image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Rice Blast',
          crop: 'Paddy Rice',
          symptoms: 'Spindle-shaped lesions with grayish centers and brown margins on leaves, nodes, and panicles.',
          causes: 'Magnaporthe oryzae fungus spread by windborne spores during cloudy humid weather.',
          prevention: 'Treat seeds with Carbendazim @ 2g/kg seed. Maintain proper field drainage.',
          management: 'Spray Tricyclazole 75% WP @ 0.6g/liter or Isoprothiolane 40% EC @ 1.5 ml/liter.',
          severity: 'CRITICAL',
          image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Pink Bollworm',
          crop: 'Cotton',
          symptoms: 'Rosetted flowers, un-opened bolls, stained lint, and larval entry holes.',
          causes: 'Pectinophora gossypiella larvae feeding inside cotton bolls.',
          prevention: 'Erect Pheromone traps @ 5 per acre for monitoring. Avoid late season ratoon cotton.',
          management: 'Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/liter or Profenofos 50% EC @ 2 ml/liter.',
          severity: 'HIGH',
          image: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&q=80&w=600',
        },
        {
          name: 'Late Blight',
          crop: 'Tomato',
          symptoms: 'Water-soaked dark green to black lesions on leaves and stems with white mold underneath.',
          causes: 'Phytophthora infestans oomycete favored by wet foggy weather.',
          prevention: 'Provide adequate row spacing, avoid overhead sprinkler irrigation.',
          management: 'Spray Mancozeb 75% WP @ 2.5g/liter or Cymoxanil + Mancozeb @ 2g/liter.',
          severity: 'HIGH',
          image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb247a5?auto=format&fit=crop&q=80&w=600',
        },
      ]);
    }

    const fertilizerCount = await Fertilizer.countDocuments();
    if (fertilizerCount === 0) {
      console.log('🧪 Seeding initial sample fertilizer advisories...');
      await Fertilizer.create([
        {
          fertilizerName: 'Urea (46% Nitrogen)',
          crop: 'Wheat',
          nutrient: 'Nitrogen',
          generalGuidance: 'Apply 120 kg N per hectare in 3 split doses: 1/3 at sowing, 1/3 at first irrigation (21 DAP), 1/3 at tillering.',
          precautions: 'Do not apply under waterlogged conditions or on wet leaf canopy. Incorporate into soil immediately after broadcast.',
        },
        {
          fertilizerName: 'DAP (Di-Ammonium Phosphate 18:46:0)',
          crop: 'Paddy Rice',
          nutrient: 'Phosphorus & Nitrogen',
          generalGuidance: 'Apply 100 kg per hectare as basal dose during field puddling prior to transplanting.',
          precautions: 'Mix thoroughly with soil. Avoid direct contact with seed roots.',
        },
        {
          fertilizerName: 'MOP (Muriate of Potash - 60% K2O)',
          crop: 'Cotton',
          nutrient: 'Potassium',
          generalGuidance: 'Apply 50 kg per hectare in 2 splits: basal at sowing and top-dressing at flowering stage to enhance boll weight.',
          precautions: 'Ensure adequate soil moisture during top dressing.',
        },
        {
          fertilizerName: 'Single Super Phosphate (SSP - 16% P2O5, 11% Sulfur)',
          crop: 'Tomato',
          nutrient: 'Phosphorus & Sulfur',
          generalGuidance: 'Apply 250 kg per hectare during bed preparation. Provides essential Sulfur for fruit flavor and firmness.',
          precautions: 'Band placement near root zone yields superior results compared to broadcast application.',
        },
      ]);
    }
  } catch (error) {
    console.error('Error seeding advisory sample data:', error.message);
  }
};

module.exports = seedAdvisoryData;
