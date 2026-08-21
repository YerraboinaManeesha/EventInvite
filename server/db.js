const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB (persistent storage via MONGODB_URI)');
    return;
  }

  // Zero-config local dev: spins up an in-memory MongoDB instance.
  // Data will NOT persist across server restarts unless MONGODB_URI is set.
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri());
  console.log('Connected to in-memory MongoDB (set MONGODB_URI for persistent storage)');
}

module.exports = connectDB;
