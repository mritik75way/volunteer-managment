import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandler from './common/middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes'
import opportunityRoutes from './modules/opportunities/opportunities.routes'

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

app.use(errorHandler);

export default app;