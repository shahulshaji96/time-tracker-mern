require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI;
console.log(MONGO);
mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log('Server running on port', PORT));
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });
