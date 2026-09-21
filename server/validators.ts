import { z } from 'zod';

export const allowedRoles = [
  'Student',
  'Developer',
  'AI Expert',
  'Freelancer',
  'Researcher',
  'Content Creator',
  'Designer',
  'Other'
] as const;

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must be under 60 characters'),
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
  role: z.string().trim().min(2, 'Role must be specified').max(60, 'Role must be under 60 characters'),
  bio: z.string().trim().max(500, 'Bio must be under 500 characters').optional(),
  profileImage: z.string().trim().refine((value) => {
    if (!value || value.startsWith('data:image/')) return true;
    try {
      const protocol = new URL(value).protocol;
      return protocol === 'http:' || protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Profile image must be a valid HTTP, HTTPS, or image data URL').optional().or(z.literal(''))
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must be under 60 characters'),
  role: z.string().trim().min(2, 'Role must be specified').max(60, 'Role must be under 60 characters'),
  bio: z.string().trim().max(500, 'Bio must be under 500 characters').optional().default(''),
  profileImage: z.string().trim().url('Profile image must be a valid URL').optional().or(z.literal(''))
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required')
});

export const mediaItemSchema = z.object({
  type: z.enum(['image', 'video']),
  url: z.string().trim().min(1, 'Media URL is required').refine((url) => {
    try {
      const protocol = new URL(url).protocol;
      return protocol === 'http:' || protocol === 'https:' || url.startsWith('data:image/') || url.startsWith('data:video/');
    } catch {
      return url.startsWith('data:image/') || url.startsWith('data:video/');
    }
  }, 'Media must use an HTTP, HTTPS, or validated data URL'),
  publicId: z.string().optional()
});

export const prototypeUrlSchema = z.string().trim().url('Must be a valid HTTP or HTTPS URL').refine(url => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}, 'URL must use http or https protocol').optional().or(z.literal(''));

export const promptSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150, 'Title must be under 150 characters'),
  promptText: z.string().trim().min(10, 'Prompt text must be at least 10 characters').max(10000, 'Prompt text is too long'),
  description: z.string().trim().max(1000, 'Description must be under 1000 characters').optional().or(z.literal('')),
  category: z.string().trim().min(2, 'Category is required').max(50, 'Category is too long'),
  tags: z.array(z.string().trim().min(1).max(30)).max(15, 'Maximum 15 tags allowed').default([]),
  media: z.array(mediaItemSchema).max(10, 'Maximum 10 media attachments allowed').default([]),
  prototypeUrl: prototypeUrlSchema
});

export const collectionSchema = z.object({
  name: z.string().trim().min(2, 'Collection name must be at least 2 characters').max(80, 'Collection name must be under 80 characters'),
  description: z.string().trim().max(500, 'Description must be under 500 characters').optional().or(z.literal('')),
  promptIds: z.array(z.string()).default([])
});

export const ratingSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5')
});
