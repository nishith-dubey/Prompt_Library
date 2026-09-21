import { Request, Response } from 'express';
import { db, PromptDoc } from '../db';
import { AuthRequest } from '../middleware/auth';
import { promptSchema } from '../validators';
import { validatePromptWithAI } from '../services/aiService';

function populatePrompt(prompt: PromptDoc, currentUserId?: string) {
  const creator = db.findUserById(prompt.userId);
  let userRating: number | null = null;
  if (currentUserId) {
    const r = db.findRating(prompt._id, currentUserId);
    if (r) userRating = r.rating;
  }

  return {
    ...prompt,
    creator: creator ? {
      _id: creator._id,
      name: creator.name,
      role: creator.role,
      profileImage: creator.profileImage,
      bio: creator.bio
    } : {
      _id: prompt.userId,
      name: 'Community Member',
      role: 'Contributor'
    },
    userRating
  };
}

export async function validatePromptPreview(req: Request, res: Response) {
  try {
    const { title, promptText, category, media } = req.body;
    if (typeof title !== 'string' || typeof promptText !== 'string' || !title.trim() || !promptText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title and prompt text are required for validation.'
      });
    }

    const aiCheck = await validatePromptWithAI(
      String(title),
      String(promptText),
      String(category || 'General'),
      Array.isArray(media) ? media : undefined
    );

    return res.json({
      success: true,
      data: aiCheck
    });
  } catch (error: any) {
    console.error('Validation preview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to run AI prompt validation.'
    });
  }
}

export async function createPrompt(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    // 1. Zod schema validation FIRST
    const parseResult = promptSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid prompt data';
      return res.status(400).json({
        success: false,
        message: firstError,
        errors: parseResult.error.issues
      });
    }

    const validatedData = parseResult.data;

    // 2. AI Content & Relevance Validation
    const aiValidation = await validatePromptWithAI(
      validatedData.title,
      validatedData.promptText,
      validatedData.category,
      validatedData.media
    );

    if (!aiValidation.allowed) {
      return res.status(400).json({
        success: false,
        message: aiValidation.reason || 'The content did not pass AI prompt quality and safety checks.',
        aiValidation
      });
    }

    // 3. Save to DB
    const newPrompt = db.createPrompt({
      userId: req.user._id,
      title: validatedData.title,
      promptText: validatedData.promptText,
      description: validatedData.description || '',
      category: validatedData.category,
      tags: validatedData.tags,
      media: validatedData.media,
      prototypeUrl: validatedData.prototypeUrl || undefined
    });

    const populated = populatePrompt(newPrompt, req.user._id);

    return res.status(201).json({
      success: true,
      message: 'Prompt created and verified successfully.',
      data: populated,
      aiValidation
    });
  } catch (error: any) {
    console.error('Create prompt error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create prompt.' });
  }
}

export async function getPrompts(req: AuthRequest, res: Response) {
  try {
    const currentUserId = req.user?._id;
    const {
      search,
      category,
      tag,
      role,
      minRating,
      userId,
      sort = 'newest'
    } = req.query;

    let prompts = [...db.getPrompts()];

    // Filter by specific user (e.g. My Prompts)
    if (userId && typeof userId === 'string') {
      prompts = prompts.filter(p => p.userId === userId);
    }

    // Filter by category
    if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
      prompts = prompts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by tag
    if (tag && typeof tag === 'string') {
      const searchTag = tag.toLowerCase().trim();
      prompts = prompts.filter(p => p.tags.some(t => t.toLowerCase() === searchTag));
    }

    // Filter by minimum rating
    if (minRating) {
      const min = Number(minRating);
      if (!isNaN(min) && min > 0) {
        prompts = prompts.filter(p => p.averageRating >= min);
      }
    }

    // Filter by creator role
    if (role && typeof role === 'string' && role.toLowerCase() !== 'all') {
      prompts = prompts.filter(p => {
        const creator = db.findUserById(p.userId);
        return creator && creator.role.toLowerCase() === role.toLowerCase();
      });
    }

    // Search filter (Case-insensitive, partial-match, multi-term over title, promptText, tags, category)
    if (search && typeof search === 'string') {
      const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
      prompts = prompts.filter(p => {
        const titleLower = p.title.toLowerCase();
        const textLower = p.promptText.toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        const catLower = p.category.toLowerCase();
        const tagsJoined = p.tags.map(t => t.toLowerCase()).join(' ');
        const creator = db.findUserById(p.userId);
        const creatorName = (creator?.name || '').toLowerCase();

        const fullCorpus = `${titleLower} ${textLower} ${descLower} ${catLower} ${tagsJoined} ${creatorName}`;
        // Every term should match somewhere in the corpus
        return terms.every(term => fullCorpus.includes(term));
      });
    }

    // Sorting
    if (sort === 'highest_rated') {
      prompts.sort((a, b) => b.averageRating - a.averageRating || b.ratingCount - a.ratingCount);
    } else if (sort === 'most_popular') {
      prompts.sort((a, b) => b.ratingCount - a.ratingCount || b.averageRating - a.averageRating);
    } else if (sort === 'alphabetical') {
      prompts.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // default: newest
      prompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const populated = prompts.map(p => populatePrompt(p, currentUserId));

    return res.json({
      success: true,
      count: populated.length,
      data: populated
    });
  } catch (error: any) {
    console.error('Get prompts error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch prompts.' });
  }
}

export async function getPromptById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const prompt = db.findPromptById(id);
    if (!prompt) {
      return res.status(404).json({ success: false, message: 'Prompt not found.' });
    }

    const currentUserId = req.user?._id;
    const populated = populatePrompt(prompt, currentUserId);

    return res.json({
      success: true,
      data: populated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch prompt details.' });
  }
}

export async function updatePrompt(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { id } = req.params;
    const existing = db.findPromptById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Prompt not found.' });
    }

    // Ownership check
    if (existing.userId !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit prompts that you created.'
      });
    }

    // Zod validation
    const parseResult = promptSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid prompt data';
      return res.status(400).json({ success: false, message: firstError });
    }

    const validatedData = parseResult.data;

    // AI validation if prompt text changed
    if (validatedData.promptText !== existing.promptText || validatedData.title !== existing.title || validatedData.category !== existing.category || JSON.stringify(validatedData.media) !== JSON.stringify(existing.media)) {
      const aiValidation = await validatePromptWithAI(
        validatedData.title,
        validatedData.promptText,
        validatedData.category,
        validatedData.media
      );
      if (!aiValidation.allowed) {
        return res.status(400).json({
          success: false,
          message: aiValidation.reason || 'Updated prompt did not pass AI validation.',
          aiValidation
        });
      }
    }

    const updated = db.updatePrompt(id, {
      title: validatedData.title,
      promptText: validatedData.promptText,
      description: validatedData.description || '',
      category: validatedData.category,
      tags: validatedData.tags,
      media: validatedData.media,
      prototypeUrl: validatedData.prototypeUrl || undefined
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Prompt not found.' });
    }

    const populated = populatePrompt(updated, req.user._id);

    return res.json({
      success: true,
      message: 'Prompt updated successfully.',
      data: populated
    });
  } catch (error: any) {
    console.error('Update prompt error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update prompt.' });
  }
}

export async function deletePrompt(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { id } = req.params;
    const existing = db.findPromptById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Prompt not found.' });
    }

    // Ownership check
    if (existing.userId !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete prompts that you created.'
      });
    }

    const success = db.deletePrompt(id);
    if (!success) {
      return res.status(500).json({ success: false, message: 'Failed to delete prompt.' });
    }

    return res.json({
      success: true,
      message: 'Prompt deleted successfully.'
    });
  } catch (error: any) {
    console.error('Delete prompt error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting prompt.' });
  }
}
