import express from 'express';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});