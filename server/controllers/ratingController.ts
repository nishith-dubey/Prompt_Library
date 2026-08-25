import { Response } from 'express';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';
import { ratingSchema } from '../validators';

export async function ratePrompt(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to rate prompts.' });
    }

    const { id } = req.params;
    const prompt = db.findPromptById(id);
    if (!prompt) {
      return res.status(404).json({ success: false, message: 'Prompt not found.' });
    }

    // Do not allow creators to rate their own prompts
    if (prompt.userId === req.user._id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rate your own prompt.'
      });
    }

    const parseResult = ratingSchema.safeParse(req.body);
    if (!parseResult.success) {
      const err = parseResult.error.issues[0]?.message || 'Rating must be an integer between 1 and 5';
      return res.status(400).json({ success: false, message: err });
    }

    const { rating } = parseResult.data;

    const result = db.setRating(id, req.user._id, rating);

    return res.json({
      success: true,
      message: 'Rating recorded successfully.',
      data: {
        userRating: result.rating.rating,
        averageRating: result.averageRating,
        ratingCount: result.ratingCount
      }
    });
  } catch (error: any) {
    console.error('Rate prompt error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record rating.' });
  }
}

export async function getUserPromptRating(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const { id } = req.params;
    const ratingDoc = db.findRating(id, req.user._id);

    return res.json({
      success: true,
      data: {
        rating: ratingDoc ? ratingDoc.rating : null
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to get user rating.' });
  }
}
