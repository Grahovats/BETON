import { Router } from 'express';
import {
  createAccount,
  getDashboard,
  listAccounts,
  manualSyncAccount,
  refreshAccount,
} from '../controllers/accountController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const accountRoutes = Router();

accountRoutes.use(authMiddleware);
accountRoutes.get('/', listAccounts);
accountRoutes.post('/', createAccount);
accountRoutes.get('/:accountId/dashboard', getDashboard);
accountRoutes.post('/:accountId/refresh', refreshAccount);
accountRoutes.post('/:accountId/manual-sync', manualSyncAccount);
