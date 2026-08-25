import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

import { register, login, getMe, updateProfile } from './server/controllers/authController';
import {
  createPrompt,
  getPrompts,
  getPromptById,
  updatePrompt,
  deletePrompt,
  validatePromptPreview
} from './server/controllers/promptController';
import { ratePrompt, getUserPromptRating } from './server/controllers/ratingController';
import {
  createCollection,
  getUserCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addPromptToCollection,
  removePromptFromCollection
} from './server/controllers/collectionController';
import { uploadMedia } from './server/controllers/uploadController';
import { requireAuth, optionalAuth } from './server/middleware/auth';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic security and parsing middleware
  app.use(cors());
  // Set json body limit up to 25MB for media uploads / screenshots
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Request logger for API calls
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Prompt Library API',
      timestamp: new Date().toISOString()
    });
  });

  // ==================== AUTH ROUTES ====================
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);
  app.get('/api/auth/me', requireAuth, getMe);
  app.put('/api/auth/profile', requireAuth, updateProfile);

  // ==================== PROMPT ROUTES ====================
  app.post('/api/prompts/validate', validatePromptPreview);
  app.post('/api/prompts', requireAuth, createPrompt);
  app.get('/api/prompts', optionalAuth, getPrompts);
  app.get('/api/prompts/:id', optionalAuth, getPromptById);
  app.put('/api/prompts/:id', requireAuth, updatePrompt);
  app.delete('/api/prompts/:id', requireAuth, deletePrompt);

  // ==================== RATING ROUTES ====================
  app.post('/api/prompts/:id/rating', requireAuth, ratePrompt);
  app.put('/api/prompts/:id/rating', requireAuth, ratePrompt);
  app.get('/api/prompts/:id/rating', requireAuth, getUserPromptRating);

  // ==================== COLLECTION ROUTES ====================
  app.post('/api/collections', requireAuth, createCollection);
  app.get('/api/collections', requireAuth, getUserCollections);
  app.get('/api/collections/:id', requireAuth, getCollectionById);
  app.put('/api/collections/:id', requireAuth, updateCollection);
  app.delete('/api/collections/:id', requireAuth, deleteCollection);
  app.post('/api/collections/:id/prompts/:promptId', requireAuth, addPromptToCollection);
  app.delete('/api/collections/:id/prompts/:promptId', requireAuth, removePromptFromCollection);

  // ==================== UPLOAD ROUTE ====================
  app.post('/api/upload', requireAuth, uploadMedia);

  // Centralized API error handling middleware
  app.use('/api', (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled API Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal Server Error'
    });
  });

  // Vite middleware for dev or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prompt Library server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
