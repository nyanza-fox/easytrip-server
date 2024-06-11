import express from 'express';
import cors from 'cors';

import accommodationRoutes from './routes/accommodationRoutes';
import authRoutes from './routes/authRoutes';
import destinationRoutes from './routes/destinationRoutes';
import guideRoutes from './routes/guideRoutes';
import orderRoutes from './routes/orderRoutes';
import publicRoutes from './routes/publicRoutes';
import transportationRoutes from './routes/transportationRoutes';
import userRoutes from './routes/userRoutes';
import errorMiddleware from './middlewares/errorMiddleware';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/transportations', transportationRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorMiddleware);

export default app;
