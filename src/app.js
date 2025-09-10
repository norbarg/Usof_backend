import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// static files (uploaded images)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// api routes
app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);
export default app;
