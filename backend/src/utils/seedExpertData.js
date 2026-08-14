const User = require('../models/User');
const Question = require('../models/Question');

const seedExpertData = async () => {
  try {
    const expertCount = await User.countDocuments({ role: 'expert' });
    if (expertCount === 0) {
      console.log('🎓 Seeding certified sample Agriculture Experts...');
      const experts = await User.create([
        {
          name: 'Dr. Harpreet Singh',
          email: 'expert.harpreet@agriadvisor.org',
          phone: '+91 98765 43210',
          password: 'password123',
          role: 'expert',
          specialization: 'Crop Protection & Agronomy',
          experience: 14,
          qualification: 'Ph.D. Agronomy (PAU Ludhiana)',
          rating: 4.9,
          ratingCount: 28,
          bio: 'Specialist in wheat rust management, crop rotation strategy, and sustainable cereal farming practices.',
          consultationFee: 350,
          profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          state: 'Punjab',
          district: 'Ludhiana',
        },
        {
          name: 'Dr. Ananya Sharma',
          email: 'expert.ananya@agriadvisor.org',
          phone: '+91 98765 43211',
          password: 'password123',
          role: 'expert',
          specialization: 'Plant Pathology & Fungal Diseases',
          experience: 11,
          qualification: 'Ph.D. Plant Pathology (IARI New Delhi)',
          rating: 4.8,
          ratingCount: 19,
          bio: 'Expert in rice blast, tomato blights, integrated pest management, and biological control techniques.',
          consultationFee: 400,
          profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
          state: 'Haryana',
          district: 'Karnal',
        },
        {
          name: 'Dr. Rajesh Kulkarni',
          email: 'expert.rajesh@agriadvisor.org',
          phone: '+91 98765 43212',
          password: 'password123',
          role: 'expert',
          specialization: 'Soil Science & Fertilizer Management',
          experience: 16,
          qualification: 'Ph.D. Soil Chemistry (MPKV Rahuri)',
          rating: 4.95,
          ratingCount: 34,
          bio: 'Specializing in soil pH correction, NPK nutrient balancing, micro-nutrient deficiencies, and organic farming.',
          consultationFee: 300,
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
          state: 'Maharashtra',
          district: 'Nashik',
        },
      ]);

      // Seed a sample Q&A question answered by Dr. Harpreet
      const farmer = await User.findOne({ role: 'farmer' });
      if (farmer) {
        await Question.create({
          farmerId: farmer._id,
          title: 'Yellowing stripes appearing on lower wheat leaves',
          crop: 'Wheat',
          description: 'I noticed yellow linear pustules on wheat leaves after recent cold foggy weather. What spray is recommended?',
          image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=600',
          status: 'ANSWERED',
          answers: [
            {
              expertId: experts[0]._id,
              expertName: experts[0].name,
              expertSpecialization: experts[0].specialization,
              answerText:
                'This appears to be Yellow Rust (Stripe Rust) triggered by low temperature and humidity. Spray Propiconazole 25% EC @ 1 ml/liter of water immediately.',
              createdAt: new Date(),
            },
          ],
        });
      }
    }
  } catch (error) {
    console.error('Error seeding expert sample data:', error.message);
  }
};

module.exports = seedExpertData;
