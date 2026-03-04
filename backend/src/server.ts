import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { authRoutes } from './routes/authRoutes.js';
import { accountRoutes } from './routes/accountRoutes.js';

const app = express();

app.use(
  cors({
    origin: config.frontendUrl,
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`Backend running on http://localhost:${config.port}`);
});
