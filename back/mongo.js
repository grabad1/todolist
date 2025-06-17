const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGODB_URI;


const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB je povezan!');
  } catch (error) {
    console.error('Greška pri povezivanju sa MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;