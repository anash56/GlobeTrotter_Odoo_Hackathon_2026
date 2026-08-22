import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/community', communityRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;
