require('dotenv').config();

const PORT = process.env.PORT || 3003;

// Retrieve the password from command line arguments
const password = process.argv[2];

// Construct the MongoDB URI based on the environment
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : `mongodb+srv://fullstack:${password}@cluster0.rspoxgv.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

const SECRET = process.env.SECRET

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
};