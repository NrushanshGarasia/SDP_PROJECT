// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     // Check if MONGODB_URI is defined
//     if (!process.env.MONGODB_URI) {
//       console.error('❌ MongoDB URI is not defined in .env file');
//       console.error('Please create a .env file with MONGODB_URI=mongodb://localhost:27017/hostel_management');
//       process.exit(1);
//     }

//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//     return conn;
//   } catch (error) {
//     console.error('❌ MongoDB Connection Error:', error.message);
//     console.error('Please ensure MongoDB is running and the connection string is correct.');
//     process.exit(1);
//   }
// };

// module.exports = connectDB;



const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Fail fast instead of buffering DB ops when disconnected
    mongoose.set('bufferCommands', false);

    // Check if MONGODB_URI is defined (support both MONGODB_URI and MONGO_URI)
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('❌ MongoDB URI is not defined in .env file');
      console.error('Please create a .env file with MONGODB_URI=mongodb://localhost:27017/hostel_management');
      console.error('⚠️  Server will continue but database operations will fail.');
      return;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('⚠️  Server will continue but database operations will fail.');
    console.error('Please ensure MongoDB is running and the connection string is correct.');
    // Don't exit - let server start anyway for development
  }
};

module.exports = connectDB;

