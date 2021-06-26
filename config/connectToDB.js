
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const dbConnection = async () => {
  const conn = await mongoose.connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log(`Dabase connected! ${conn.connection.host}`);
};

module.exports = dbConnection;