const Datastore = require('nedb-promises');
const path = require('path');

// Create databases for different collections
const databases = {
  users: Datastore.create({ 
    filename: path.join(__dirname, '../data/users.db'), 
    autoload: true 
  }),
  activities: Datastore.create({ 
    filename: path.join(__dirname, '../data/activities.db'), 
    autoload: true 
  })
};

const connectDB = async () => {
  try {
    // Create data directory if it doesn't exist
    const fs = require('fs');
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    console.log('NeDB databases initialized successfully');
    return databases;
  } catch (error) {
    console.error('Database initialization error:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, databases };