import { Response } from 'express';
import { db, CollectionDoc } from '../db';
import { AuthRequest } from '../middleware/auth';
import { collectionSchema } from '../validators';

function populateCollectionWithPrompts(collection: CollectionDoc) {
  const prompts = collection.promptIds
    .map(pid => db.findPromptById(pid))
    .filter(Boolean)
    .map(p => {
      const creator = db.findUserById(p!.userId);
      return {
        ...p!,
        creator: creator ? {
          _id: creator._id,
          name: creator.name,
          role: creator.role,
          profileImage: creator.profileImage
        } : {
          _id: p!.userId,
          name: 'Community Member',
          role: 'Contributor'
        }
      };
    });

  return {
    ...collection,
    prompts,
    promptCount: collection.promptIds.length
  };
}

export async function createCollection(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const parseResult = collectionSchema.safeParse(req.body);
    if (!parseResult.success) {
      const err = parseResult.error.issues[0]?.message || 'Invalid collection input';
      return res.status(400).json({ success: false, message: err });
    }

    const { name, description, promptIds } = parseResult.data;

    const newCollection = db.createCollection({
      userId: req.user._id,
      name,
      description: description || '',
      promptIds: promptIds || []
    });

    return res.status(201).json({
      success: true,
      message: 'Collection created successfully.',
      data: populateCollectionWithPrompts(newCollection)
    });
  } catch (error: any) {
    console.error('Create collection error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create collection.' });
  }
}

export async function getUserCollections(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const collections = db.findCollectionsByUserId(req.user._id);
    const populated = collections.map(populateCollectionWithPrompts);

    return res.json({
      success: true,
      data: populated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch collections.' });
  }
}

export async function getCollectionById(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { id } = req.params;
    const collection = db.findCollectionById(id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found.' });
    }

    // Ownership check
    if (collection.userId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to collection.' });
    }

    return res.json({
      success: true,
      data: populateCollectionWithPrompts(collection)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch collection details.' });
  }
}

export async function updateCollection(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { id } = req.params;
    const collection = db.findCollectionById(id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found.' });
    }

    // Ownership check
    if (collection.userId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this collection.' });
    }

    const { name, description } = req.body;
    const updates: any = {};
    if (typeof name === 'string' && name.trim().length >= 2) updates.name = name.trim();
    if (typeof description === 'string') updates.description = description.trim();

    const updated = db.updateCollection(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Collection not found.' });
    }

    return res.json({
      success: true,
      message: 'Collection updated successfully.',
      data: populateCollectionWithPrompts(updated)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update collection.' });
  }
}

export async function deleteCollection(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { id } = req.params;
    const collection = db.findCollectionById(id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found.' });
    }

    // Ownership check
    if (collection.userId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this collection.' });
    }

    db.deleteCollection(id);

    return res.json({
      success: true,
      message: 'Collection deleted successfully.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete collection.' });
  }
}

export async function addPromptToCollection(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { id, promptId } = req.params;
    const collection = db.findCollectionById(id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found.' });
    }

    // Ownership check
    if (collection.userId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this collection.' });
    }

    const prompt = db.findPromptById(promptId);
    if (!prompt) {
      return res.status(404).json({ success: false, message: 'Target prompt not found.' });
    }

    const updated = db.addPromptToCollection(id, promptId);
    return res.json({
      success: true,
      message: 'Prompt added to collection.',
      data: updated ? populateCollectionWithPrompts(updated) : null
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to add prompt to collection.' });
  }
}

export async function removePromptFromCollection(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { id, promptId } = req.params;
    const collection = db.findCollectionById(id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found.' });
    }

    // Ownership check
    if (collection.userId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this collection.' });
    }

    const updated = db.removePromptFromCollection(id, promptId);
    return res.json({
      success: true,
      message: 'Prompt removed from collection.',
      data: updated ? populateCollectionWithPrompts(updated) : null
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to remove prompt from collection.' });
  }
}
