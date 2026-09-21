import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export async function uploadMedia(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to upload media.' });
    }

    const { dataUrl, fileName, fileType, mediaType } = req.body;

    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return res.status(400).json({
        success: false,
        message: 'Valid media data or URL is required.'
      });
    }

    const match = dataUrl.match(/^data:(image|video)\/([a-z0-9.+-]+);base64,([\s\S]+)$/i);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Media must be a base64 image or video data URL.' });
    }

    const [, dataType, subtype, encoded] = match;
    const type: 'image' | 'video' = dataType === 'video' ? 'video' : 'image';
    const declaredType = fileType || `${dataType}/${subtype}`;
    if (mediaType !== type || !declaredType.startsWith(`${type}/`)) {
      return res.status(400).json({ success: false, message: 'Media type does not match the uploaded file.' });
    }

    const decodedBytes = Math.floor((encoded.length * 3) / 4) - (encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0);
    if (decodedBytes <= 0 || decodedBytes > 15 * 1024 * 1024) {
      return res.status(413).json({ success: false, message: 'Media file must be smaller than 15MB.' });
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
