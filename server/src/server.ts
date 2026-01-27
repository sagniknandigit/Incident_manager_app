import dotenv from 'dotenv';
dotenv.config(); // MUST be at the top

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port 5000');
});
