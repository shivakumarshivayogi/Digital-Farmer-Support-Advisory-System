const Scheme = require('../models/Scheme');

const seedSchemeData = async () => {
  try {
    const count = await Scheme.countDocuments();
    if (count === 0) {
      console.log('🏛️ Seeding official government agricultural schemes...');
      await Scheme.create([
        {
          schemeName: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
          description: 'A Central Sector scheme to provide income support of ₹6,000 per year to all landholding farmers families across the country in 3 equal installments of ₹2,000.',
          eligibility: 'All landholding farmers families having cultivable landholding in their names. Excludes institutional landholders and high income earners.',
          benefits: '₹6,000 per year directly transferred to the bank account of the beneficiary farmer in three installments.',
          documentsRequired: 'Aadhaar Card, Land ownership documents (Khatauni/Khasra), Bank account passbook, Mobile number.',
          applicationProcess: 'Register online at PM-KISAN portal (pmkisan.gov.in) using self-registration or through nearest CSC center.',
          officialUrl: 'https://pmkisan.gov.in',
          state: 'All-India / National',
          status: 'ACTIVE',
        },
        {
          schemeName: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
          description: 'Comprehensive crop insurance coverage against non-preventable natural risks like drought, flood, inundation, pests, and diseases from pre-sowing to post-harvest.',
          eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas are eligible.',
          benefits: 'Maximum premium payable by farmer is only 2% for Kharif crops, 1.5% for Rabi crops, and 5% for Annual Commercial/Horticultural crops.',
          documentsRequired: 'Land revenue document (Khasra/Khatauni), Land possession certificate, Bank passbook, Aadhaar card, Sowing certificate.',
          applicationProcess: 'Apply online via PMFBY portal (pmfby.gov.in), designated commercial banks, or Common Service Centres (CSC).',
          officialUrl: 'https://pmfby.gov.in',
          state: 'All-India / National',
          status: 'ACTIVE',
        },
        {
          schemeName: 'Kisan Credit Card (KCC) Scheme',
          description: 'Provides timely credit to farmers to meet their cultivation expenses, post-harvest costs, and maintenance of farm assets at concessional interest rates.',
          eligibility: 'Individual farmers, joint borrowers, tenant farmers, oral lessees, and Self Help Groups (SHGs) of farmers.',
          benefits: 'Credit limit up to ₹3 Lakhs at concessional interest rate of 4% per annum (after 3% prompt repayment incentive).',
          documentsRequired: 'Application form, Identity proof (Aadhaar/Voter ID), Land ownership proof, Address proof, Passport size photo.',
          applicationProcess: 'Submit application form at any Commercial Bank, RRB, or Cooperative Bank branch.',
          officialUrl: 'https://www.myscheme.gov.in/schemes/kcc',
          state: 'All-India / National',
          status: 'ACTIVE',
        },
        {
          schemeName: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
          description: 'Focuses on expanding cultivable area under assured irrigation, improving water use efficiency (More Crop Per Drop), and micro-irrigation.',
          eligibility: 'All farmers having cultivable land with a water source. Priority given to small and marginal farmers.',
          benefits: 'Subsidies up to 55% for small/marginal farmers and 45% for other farmers on Drip and Sprinkler irrigation systems.',
          documentsRequired: 'Aadhaar card, Land title documents, Water source availability certificate, Bank account details.',
          applicationProcess: 'Apply through State Agriculture / Horticulture Department portal or District Irrigation Officer.',
          officialUrl: 'https://pmksy.gov.in',
          state: 'All-India / National',
          status: 'ACTIVE',
        },
        {
          schemeName: 'Soil Health Card Scheme',
          description: 'Provides soil health cards to farmers containing crop-wise recommendations of nutrients and fertilizers required for their individual farm plots.',
          eligibility: 'All farmers owning or cultivating agricultural land in India.',
          benefits: 'Free soil testing for 12 parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) and customized fertilizer guidance.',
          documentsRequired: 'Aadhaar card, Land record survey number, Farmer mobile number.',
          applicationProcess: 'Soil samples are collected by agriculture department officials or farmers can submit samples at district soil testing labs.',
          officialUrl: 'https://soilhealth.dac.gov.in',
          state: 'All-India / National',
          status: 'ACTIVE',
        },
      ]);
    }
  } catch (error) {
    console.error('Error seeding government scheme sample data:', error.message);
  }
};

module.exports = seedSchemeData;
