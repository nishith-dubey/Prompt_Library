export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  profileImage?: string;
  createdAt: string;
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  publicId?: string;
}

export interface PromptCreator {
  _id: string;
  name: string;
  role: string;
  profileImage?: string;
  bio?: string;
}

export interface Prompt {
  _id: string;
  userId: string;
  title: string;
  promptText: string;
  description?: string;
  tags: string[];
  category: string;
  media: MediaItem[];
  prototypeUrl?: string;
  averageRating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  creator: PromptCreator;
  userRating?: number | null;
}

export interface Collection {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  promptIds: string[];
  prompts?: Prompt[];
  promptCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIValidationResult {
  allowed: boolean;
  reason: string;
  categorySuggestion?: string;
  confidence?: number;
}

export const CATEGORIES = [
  'All',
  'Career',
  'Coding',
  'Marketing',
  'Education',
  'Design',
  'Writing',
  'Productivity',
  'Business',
  'Other'
] as const;

export const ROLES = [
  'Student',
  'Developer',
  'AI Expert',
  'Freelancer',
  'Researcher',
  'Content Creator',
  'Designer',
  'Other'
] as const;
