import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { generateToken, AuthRequest } from '../middleware/auth';
import { registerSchema, loginSchema } from '../validators';

export async function register(req: Request, res: Response) {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      const err = parseResult.error.issues[0]?.message || 'Invalid registration input';
      return res.status(400).json({ success: false, message: err });
    }

    const { name, email, password, role, bio, profileImage } = parseResult.data;

    // Check if email already exists
    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = db.createUser({
      name,
      email,
      passwordHash,
      role,
      bio: bio || '',
      profileImage: profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        bio: newUser.bio,
        profileImage: newUser.profileImage,
        createdAt: newUser.createdAt
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      const err = parseResult.error.issues[0]?.message || 'Invalid login credentials';
      return res.status(400).json({ success: false, message: err });
    }

    const { email, password } = parseResult.data;
    const user = db.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = req.user;
    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error fetching user profile.' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { name, role, bio, profileImage } = req.body;
    const updates: any = {};
    if (typeof name === 'string' && name.trim().length >= 2) updates.name = name.trim();
    if (typeof role === 'string' && role.trim().length >= 2) updates.role = role.trim();
    if (typeof bio === 'string') updates.bio = bio.trim();
    if (typeof profileImage === 'string') updates.profileImage = profileImage.trim();

    const updated = db.updateUser(req.user._id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        bio: updated.bio,
        profileImage: updated.profileImage,
        createdAt: updated.createdAt
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
}
