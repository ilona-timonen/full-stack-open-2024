const app = require('./app')
const mongoose = require('mongoose');
const config = require('./utils/config')
const logger = require('./utils/logger')


mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });
  
  if (process.env.NODE_ENV !== 'test') {
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  }
  
  module.exports = server;