import fs from 'fs';
import path from 'path';

export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  bio?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  publicId?: string;
}

export interface PromptDoc {
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
}

export interface CollectionDoc {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  promptIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RatingDoc {
  _id: string;
  promptId: string;
  userId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseData {
  users: UserDoc[];
  prompts: PromptDoc[];
  collections: CollectionDoc[];
  ratings: RatingDoc[];
}

const DATA_FILE = process.env.PROMPT_LIBRARY_DB_FILE || path.join(process.cwd(), '.data', 'db.json');
const DATA_DIR = path.dirname(DATA_FILE);

const INITIAL_SEED: DatabaseData = {
  users: [
    {
      _id: "user_expert_1",
      name: "Dr. Sarah Lin",
      email: "sarah.lin@ai-prompt.io",
      // bcrypt hash for 'password123'
      passwordHash: "$2a$10$wK1Rk9Y0nly/r5Bv.g9W4OpY3vE124r7wY6m7P0g.O23j3JtYfOtu",
      role: "AI Expert",
      bio: "Senior AI Systems Architect & prompt engineering researcher focusing on LLM reasoning architectures.",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      createdAt: "2026-01-15T08:00:00.000Z",
      updatedAt: "2026-01-15T08:00:00.000Z"
    },
    {
      _id: "user_dev_2",
      name: "Alex Rivera",
      email: "alex.rivera@devhub.com",
      passwordHash: "$2a$10$wK1Rk9Y0nly/r5Bv.g9W4OpY3vE124r7wY6m7P0g.O23j3JtYfOtu",
      role: "Developer",
      bio: "Full-stack engineer crafting developer tooling, automated test pipelines, and AI copilot workflows.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      createdAt: "2026-02-01T10:30:00.000Z",
      updatedAt: "2026-02-01T10:30:00.000Z"
    },
    {
      _id: "user_student_3",
      name: "Nishith Dubey",
      email: "nishithrbd@gmail.com",
      passwordHash: "$2a$10$wK1Rk9Y0nly/r5Bv.g9W4OpY3vE124r7wY6m7P0g.O23j3JtYfOtu",
      role: "Student",
      bio: "CS student exploring prompt design, system benchmarking, and algorithmic optimization.",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      createdAt: "2026-02-10T12:00:00.000Z",
      updatedAt: "2026-02-10T12:00:00.000Z"
    },
    {
      _id: "user_writer_4",
      name: "Elena Rostova",
      email: "elena.rostova@contentlab.io",
      passwordHash: "$2a$10$wK1Rk9Y0nly/r5Bv.g9W4OpY3vE124r7wY6m7P0g.O23j3JtYfOtu",
      role: "Content Creator",
      bio: "Editorial strategist & prompt artist crafting narrative structures, brand voices, and educational curricula.",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      createdAt: "2026-02-15T14:20:00.000Z",
      updatedAt: "2026-02-15T14:20:00.000Z"
    }
  ],
  prompts: [
    {
      _id: "prompt_1",
      userId: "user_expert_1",
      title: "ATS-Optimized Executive Resume Builder & Gap Analyzer",
      promptText: `Act as a Tier-1 Executive Recruiter and ATS (Applicant Tracking System) Specialist. I will provide my current resume text and a target Job Description (JD). 

Conduct a rigorous multi-phase audit:
1. ATS Keyword Alignment: Identify missing hard skills, certifications, and high-frequency industry terms.
2. Bullet-Point Enhancement: Rewrite bullet points using the Google XYZ Formula ("Accomplished [X] as measured by [Y] by doing [Z]") with active power verbs.
3. Career Gap & Transition Framing: Provide strategic phrasing for transitions without sounding apologetic.
4. Executive Summary: Formulate a 3-sentence high-impact opening tailored strictly for the target role.

Target Job Description: [PASTE_JD_HERE]
Current Resume: [PASTE_RESUME_HERE]`,
      description: "Transforms standard resume bullet points into Google XYZ-formula metrics tailored for modern ATS filters and hiring managers.",
      category: "Career",
      tags: ["resume", "ATS", "career", "interview", "job search"],
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80"
        }
      ],
      prototypeUrl: "https://resume-ats-analyzer-demo.vercel.app",
      averageRating: 4.9,
      ratingCount: 14,
      createdAt: "2026-02-12T09:00:00.000Z",
      updatedAt: "2026-02-12T09:00:00.000Z"
    },
    {
      _id: "prompt_2",
      userId: "user_dev_2",
      title: "Clean Architecture Backend Refactorer & Type Guard Generator",
      promptText: `You are a Principal Software Architect specializing in TypeScript, Express/Fastify, and Clean Architecture (Domain-Driven Design).

Analyze the provided legacy controller/service snippet and refactor it according to:
- Single Responsibility Principle (SRP)
- Dependency Inversion (Repository Pattern interfaces)
- Explicit Zod / TypeScript type guards for all I/O
- Centralized custom domain errors with HTTP status codes
- Idempotency and transactional safety guidelines

Here is the code to refactor:
\`\`\`typescript
[PASTE_LEGACY_CODE_HERE]
\`\`\``,
      description: "Transforms messy monolith controller code into modular clean architecture services with strict TypeScript & Zod validation.",
      category: "Coding",
      tags: ["typescript", "clean architecture", "refactoring", "backend", "express"],
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
        }
      ],
      prototypeUrl: "https://github.com/alexrivera-dev/clean-architecture-template",
      averageRating: 4.8,
      ratingCount: 19,
      createdAt: "2026-02-14T11:15:00.000Z",
      updatedAt: "2026-02-14T11:15:00.000Z"
    },
    {
      _id: "prompt_3",
      userId: "user_writer_4",
      title: "B2B SaaS Content Repurposer (Podcast & Video to 5 Formats)",
      promptText: `You are an omnichannel growth marketing director and viral LinkedIn copywriter.

Take the attached transcript of a technical podcast / webinar and repurpose it into:
1. A 1,200-word SEO Pillar Article with clear H2/H3 hierarchy and actionable takeaways.
2. A high-hook 7-slide LinkedIn Carousel outline (Headline, Slide 1-7 text, CTA).
3. A 5-post X (Twitter) Thread with cliffhanger transitions and metric-backed quotes.
4. A 2-minute TL;DR executive email newsletter excerpt.
5. Three YouTube short/TikTok script hooks with visual stage directions.

Source Transcript:
[PASTE_TRANSCRIPT_HERE]`,
      description: "Turns long-form webinar transcripts and podcasts into 5 high-converting marketing assets with distinct brand hooks.",
      category: "Marketing",
      tags: ["marketing", "content creation", "b2b", "linkedin", "seo"],
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80"
        }
      ],
      prototypeUrl: "https://contentlab-repurposer.framer.app",
      averageRating: 4.7,
      ratingCount: 11,
      createdAt: "2026-02-18T16:00:00.000Z",
      updatedAt: "2026-02-18T16:00:00.000Z"
    },
    {
      _id: "prompt_4",
      userId: "user_student_3",
      title: "Socratic Feynman Technique Master Tutor",
      promptText: `Adopt the persona of Richard Feynman combined with a patient Socratic Tutor.
I want to deeply understand the following concept: [CONCEPT_NAME].

Rules:
1. Never give me the entire lecture all at once.
2. Begin by asking me to explain what I currently know or think about this topic in 2-3 sentences.
3. Once I reply, pinpoint any intuition gaps or jargon traps, and explain the core principle using a vivid real-world analogy (like bicycles, water pipes, or baking).
4. Ask me ONE targeted question to test my fundamental intuition before advancing.
5. Repeat until I can explain the mechanism back to you from first principles.`,
      description: "Interactive Socratic study tutor that breaks down complex scientific and mathematical concepts using analogies and step-by-step questions.",
      category: "Education",
      tags: ["study", "feynman", "socratic", "learning", "tutoring"],
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"
        }
      ],
      prototypeUrl: "https://socratic-feynman.vercel.app",
      averageRating: 5.0,
      ratingCount: 22,
      createdAt: "2026-02-20T10:00:00.000Z",
      updatedAt: "2026-02-20T10:00:00.000Z"
    },
    {
      _id: "prompt_5",
      userId: "user_expert_1",
      title: "Figma UI/UX Component System & Accessibility Specifier",
      promptText: `Act as a Design System Lead and Accessibility (WCAG 2.2 AAA) Auditor.

Given a user interface component requirement: [COMPONENT_NAME / DESCRIPTION], provide a comprehensive design specification:
1. Semantic HTML & ARIA roles/states (e.g. aria-expanded, role="dialog", focus trap).
2. Keyboard navigation matrix (Tab, Shift+Tab, Arrow keys, Escape, Enter, Space).
3. Design Tokens (Padding, Corner Radius, Contrast ratios for Light & Dark mode).
4. Responsive behavior across Mobile (360px), Tablet (768px), and Desktop (1440px).
5. Edge-case states: Empty, Loading Skeleton, Error, Long-text truncation, Disabled.`,
      description: "Generates thorough WCAG 2.2 AAA specifications, ARIA interaction matrices, and responsive token states for UI designers and frontend developers.",
      category: "Design",
      tags: ["design", "ui", "ux", "accessibility", "figma", "design system"],
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80"
        }
      ],
      prototypeUrl: "https://figma.com/@designsystem-specs-example",
      averageRating: 4.85,
      ratingCount: 16,
      createdAt: "2026-02-21T13:40:00.000Z",
      updatedAt: "2026-02-21T13:40:00.000Z"
    },
    {
      _id: "prompt_6",
      userId: "user_dev_2",
      title: "Full-Stack System Design Mock Interviewer (FAANG Level)",
      promptText: `You are an Engineering Director conducting a 45-minute System Design Interview.
Target Problem: Design [SYSTEM_NAME - e.g., TinyURL, Uber Backend, Distributed Message Queue, Realtime Collaborative Canvas].

Format:
- Step 1: Functional & Non-Functional Requirements scoping (Ask me to clarify scale, QPS, latency, consistency vs availability).
- Step 2: High-Level Architecture & API Endpoints.
- Step 3: Deep dive into bottlenecks, data modeling, partitioning strategies (sharding, caching, message queues).
- Grade my responses after each step, pointing out single points of failure (SPOFs) or scalability bottlenecks.`,
      description: "Interactive mock interviewer for distributed systems, throughput calculations, and database partitioning strategies.",
      category: "Coding",
      tags: ["system design", "interview", "architecture", "distributed systems", "faang"],
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
        }
      ],
      prototypeUrl: "https://system-design-trainer.dev",
      averageRating: 4.92,
      ratingCount: 25,
      createdAt: "2026-02-22T15:20:00.000Z",
      updatedAt: "2026-02-22T15:20:00.000Z"
    }
  ],
  collections: [
    {
      _id: "col_1",
      userId: "user_student_3",
      name: "Core Tech & Career Toolkit",
      description: "My primary collection of top-rated prompts for technical interviews, resumes, and system architecture.",
      promptIds: ["prompt_1", "prompt_2", "prompt_6"],
      createdAt: "2026-02-23T08:00:00.000Z",
      updatedAt: "2026-02-23T08:00:00.000Z"
    },
    {
      _id: "col_2",
      userId: "user_expert_1",
      name: "Product Design & Accessibility Hub",
      description: "Comprehensive specs, UI components, and Figma prompts.",
      promptIds: ["prompt_5", "prompt_3"],
      createdAt: "2026-02-23T09:30:00.000Z",
      updatedAt: "2026-02-23T09:30:00.000Z"
    }
  ],
  ratings: [
    { _id: "r_1", promptId: "prompt_1", userId: "user_dev_2", rating: 5, createdAt: "2026-02-13T10:00:00.000Z", updatedAt: "2026-02-13T10:00:00.000Z" },
    { _id: "r_2", promptId: "prompt_1", userId: "user_student_3", rating: 5, createdAt: "2026-02-14T12:00:00.000Z", updatedAt: "2026-02-14T12:00:00.000Z" },
    { _id: "r_3", promptId: "prompt_2", userId: "user_expert_1", rating: 5, createdAt: "2026-02-15T14:00:00.000Z", updatedAt: "2026-02-15T14:00:00.000Z" },
    { _id: "r_4", promptId: "prompt_2", userId: "user_student_3", rating: 5, createdAt: "2026-02-16T15:00:00.000Z", updatedAt: "2026-02-16T15:00:00.000Z" },
    { _id: "r_5", promptId: "prompt_4", userId: "user_expert_1", rating: 5, createdAt: "2026-02-21T11:00:00.000Z", updatedAt: "2026-02-21T11:00:00.000Z" },
    { _id: "r_6", promptId: "prompt_4", userId: "user_dev_2", rating: 5, createdAt: "2026-02-21T12:00:00.000Z", updatedAt: "2026-02-21T12:00:00.000Z" },
    { _id: "r_7", promptId: "prompt_5", userId: "user_student_3", rating: 5, createdAt: "2026-02-22T08:00:00.000Z", updatedAt: "2026-02-22T08:00:00.000Z" },
    { _id: "r_8", promptId: "prompt_6", userId: "user_student_3", rating: 5, createdAt: "2026-02-23T10:00:00.000Z", updatedAt: "2026-02-23T10:00:00.000Z" }
  ]
};

class LocalDB {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read persistent DB file, initializing seed:', e);
    }
    this.saveData(INITIAL_SEED);
    return INITIAL_SEED;
  }

  private saveData(data: DatabaseData): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      this.data = data;
    } catch (e) {
      console.error('Error saving DB file:', e);
    }
  }

  // Users
  getUsers(): UserDoc[] {
    return this.data.users;
  }

  findUserById(id: string): UserDoc | undefined {
    return this.data.users.find(u => u._id === id);
  }

  findUserByEmail(email: string): UserDoc | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<UserDoc, '_id' | 'createdAt' | 'updatedAt'>): UserDoc {
    const newUser: UserDoc = {
      ...user,
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.saveData(this.data);
    return newUser;
  }

  updateUser(id: string, updates: Partial<Omit<UserDoc, '_id' | 'createdAt'>>): UserDoc | null {
    const idx = this.data.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData(this.data);
    return this.data.users[idx];
  }

  // Prompts
  getPrompts(): PromptDoc[] {
    return this.data.prompts;
  }

  findPromptById(id: string): PromptDoc | undefined {
    return this.data.prompts.find(p => p._id === id);
  }

  createPrompt(prompt: Omit<PromptDoc, '_id' | 'averageRating' | 'ratingCount' | 'createdAt' | 'updatedAt'>): PromptDoc {
    const newPrompt: PromptDoc = {
      ...prompt,
      _id: 'prompt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      averageRating: 0,
      ratingCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.prompts.unshift(newPrompt);
    this.saveData(this.data);
    return newPrompt;
  }

  updatePrompt(id: string, updates: Partial<Omit<PromptDoc, '_id' | 'userId' | 'createdAt'>>): PromptDoc | null {
    const idx = this.data.prompts.findIndex(p => p._id === id);
    if (idx === -1) return null;
    this.data.prompts[idx] = {
      ...this.data.prompts[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData(this.data);
    return this.data.prompts[idx];
  }

  deletePrompt(id: string): boolean {
    const initialLen = this.data.prompts.length;
    this.data.prompts = this.data.prompts.filter(p => p._id !== id);
    // Also remove from all collections
    this.data.collections.forEach(c => {
      c.promptIds = c.promptIds.filter(pid => pid !== id);
    });
    // And delete ratings
    this.data.ratings = this.data.ratings.filter(r => r.promptId !== id);
    this.saveData(this.data);
    return this.data.prompts.length < initialLen;
  }

  // Collections
  getCollections(): CollectionDoc[] {
    return this.data.collections;
  }

  findCollectionsByUserId(userId: string): CollectionDoc[] {
    return this.data.collections.filter(c => c.userId === userId);
  }

  findCollectionById(id: string): CollectionDoc | undefined {
    return this.data.collections.find(c => c._id === id);
  }

  createCollection(col: Omit<CollectionDoc, '_id' | 'createdAt' | 'updatedAt'>): CollectionDoc {
    const newCol: CollectionDoc = {
      ...col,
      _id: 'col_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      promptIds: col.promptIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.collections.unshift(newCol);
    this.saveData(this.data);
    return newCol;
  }

  updateCollection(id: string, updates: Partial<Omit<CollectionDoc, '_id' | 'userId' | 'createdAt'>>): CollectionDoc | null {
    const idx = this.data.collections.findIndex(c => c._id === id);
    if (idx === -1) return null;
    this.data.collections[idx] = {
      ...this.data.collections[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData(this.data);
    return this.data.collections[idx];
  }

  deleteCollection(id: string): boolean {
    const initialLen = this.data.collections.length;
    this.data.collections = this.data.collections.filter(c => c._id !== id);
    this.saveData(this.data);
    return this.data.collections.length < initialLen;
  }

  addPromptToCollection(collectionId: string, promptId: string): CollectionDoc | null {
    const col = this.findCollectionById(collectionId);
    if (!col) return null;
    if (!col.promptIds.includes(promptId)) {
      col.promptIds.push(promptId);
      col.updatedAt = new Date().toISOString();
      this.saveData(this.data);
    }
    return col;
  }

  removePromptFromCollection(collectionId: string, promptId: string): CollectionDoc | null {
    const col = this.findCollectionById(collectionId);
    if (!col) return null;
    col.promptIds = col.promptIds.filter(id => id !== promptId);
    col.updatedAt = new Date().toISOString();
    this.saveData(this.data);
    return col;
  }

  // Ratings
  getRatingsForPrompt(promptId: string): RatingDoc[] {
    return this.data.ratings.filter(r => r.promptId === promptId);
  }

  findRating(promptId: string, userId: string): RatingDoc | undefined {
    return this.data.ratings.find(r => r.promptId === promptId && r.userId === userId);
  }

  setRating(promptId: string, userId: string, ratingValue: number): { rating: RatingDoc; averageRating: number; ratingCount: number } {
    const existing = this.findRating(promptId, userId);
    let ratingDoc: RatingDoc;
    if (existing) {
      existing.rating = ratingValue;
      existing.updatedAt = new Date().toISOString();
      ratingDoc = existing;
    } else {
      ratingDoc = {
        _id: 'r_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        promptId,
        userId,
        rating: ratingValue,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.data.ratings.push(ratingDoc);
    }

    // Recalculate prompt average & count
    const allForPrompt = this.getRatingsForPrompt(promptId);
    const count = allForPrompt.length;
    const sum = allForPrompt.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = count > 0 ? Number((sum / count).toFixed(2)) : 0;

    const pIdx = this.data.prompts.findIndex(p => p._id === promptId);
    if (pIdx !== -1) {
      this.data.prompts[pIdx].averageRating = avg;
      this.data.prompts[pIdx].ratingCount = count;
      this.data.prompts[pIdx].updatedAt = new Date().toISOString();
    }

    this.saveData(this.data);
    return { rating: ratingDoc, averageRating: avg, ratingCount: count };
  }
}

export const db = new LocalDB();
