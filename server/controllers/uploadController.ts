import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export async function uploadMedia(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to upload media.' });
    }

    const { dataUrl, fileName, fileType, mediaType } = req.body;

    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid media data or URL is required.'
      });
    }

    // Determine type (image or video)
    let type: 'image' | 'video' = 'image';
    if (mediaType === 'video' || (fileType && fileType.startsWith('video/')) || dataUrl.startsWith('data:video/')) {
      type = 'video';
    }

    // If Cloudinary credentials exist in environment, we could upload to Cloudinary.
    // Otherwise, we store the valid URI / data URL directly with a unique ID.
    const publicId = `media_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return res.status(200).json({
      success: true,
      message: 'Media processed successfully',
      data: {
        type,
        url: dataUrl,
        publicId,
        fileName: fileName || 'attachment'
      }
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process media upload.' });
  }
}
