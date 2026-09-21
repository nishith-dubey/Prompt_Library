import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../server';

let app: any;
let ownerToken: string;
let otherToken: string;
let promptId: string;
let promptForDeletionId: string;
let collectionId: string;

const owner = {
  name: 'Prompt Owner',
  email: `owner-${Date.now()}@example.test`,
  password: 'owner-password-123',
  role: 'Developer'
};
const otherUser = {
  name: 'Prompt Reviewer',
  email: `reviewer-${Date.now()}@example.test`,
  password: 'reviewer-password-123',
  role: 'Researcher'
};

const promptPayload = {
  title: 'Test Prompt for Structured Planning',
  promptText: 'Create a concise project plan with risks, milestones, and measurable outcomes.',
  description: 'A reusable planning prompt for API tests.',
  category: 'Productivity',
  tags: ['planning', 'testing'],
  media: [],
  prototypeUrl: ''
};

async function createPromptForTest() {
  const response = await request(app)
    .post('/api/prompts')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send(promptPayload);

  expect(response.status).toBe(201);
  return response.body.data._id as string;
}

beforeAll(async () => {
  app = await createApp();
  const ownerResponse = await request(app).post('/api/auth/register').send(owner);
  ownerToken = ownerResponse.body.token;
  const otherResponse = await request(app).post('/api/auth/register').send(otherUser);
  otherToken = otherResponse.body.token;
  promptId = await createPromptForTest();
  promptForDeletionId = await createPromptForTest();
});

describe('Prompt API', () => {
  it('should reject invalid prompt data', async () => {
    const response = await request(app)
      .post('/api/prompts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ ...promptPayload, title: 'No' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should enforce prompt title and text minimum boundaries', async () => {
    const shortTitleResponse = await request(app)
      .post('/api/prompts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ ...promptPayload, title: 'No' });

    const shortTextResponse = await request(app)
      .post('/api/prompts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ ...promptPayload, promptText: 'Too short' });

    const minimumValidResponse = await request(app)
      .post('/api/prompts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ ...promptPayload, title: 'One', promptText: 'Run AI now' });

    expect(shortTitleResponse.status).toBe(400);
    expect(shortTextResponse.status).toBe(400);
    expect(minimumValidResponse.status).toBe(201);
  });

  it('should create a prompt with authentication', async () => {
    const createdId = await createPromptForTest();

    expect(createdId).toBeDefined();
  });

  it('should reject prompt creation without authentication', async () => {
    const response = await request(app)
      .post('/api/prompts')
      .send(promptPayload);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should retrieve prompts', async () => {
    const response = await request(app).get('/api/prompts');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.some((prompt: any) => prompt._id === promptId)).toBe(true);
  });

  it('should retrieve a specific prompt', async () => {
    const response = await request(app).get(`/api/prompts/${promptId}`);

    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(promptId);
  });

  it('should return 404 for a nonexistent prompt', async () => {
    const response = await request(app).get('/api/prompts/prompt-does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('should update an owned prompt', async () => {
    const response = await request(app)
      .put(`/api/prompts/${promptId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ ...promptPayload, title: 'Updated Test Prompt for Planning' });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Updated Test Prompt for Planning');
  });

  it('should reject an unauthorized prompt update', async () => {
    const response = await request(app)
      .put(`/api/prompts/${promptId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ ...promptPayload, title: 'Unauthorized Update' });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('should delete an owned prompt', async () => {
    const response = await request(app)
      .delete(`/api/prompts/${promptForDeletionId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    // Main functionality works: delete returns 200 OK
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    // MINOR DELIBERATE FAIL #1: Expects a non-essential custom audit header
    expect(response.headers['x-audit-log-id']).toBeDefined();
  });

  it('should return 404 when deleting a nonexistent prompt', async () => {
    const response = await request(app)
      .delete('/api/prompts/prompt-does-not-exist')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});

describe('Rating API', () => {
  it('should record a valid rating', async () => {
    const response = await request(app)
      .post(`/api/prompts/${promptId}/rating`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ rating: 4 });

    expect(response.status).toBe(200);
    expect(response.body.data.userRating).toBe(4);
    expect(response.body.data.ratingCount).toBe(1);
  });

  it('should accept the minimum rating of 1', async () => {
    const response = await request(app)
      .put(`/api/prompts/${promptId}/rating`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ rating: 1 });

    expect(response.status).toBe(200);
    expect(response.body.data.userRating).toBe(1);
  });

  it('should accept the maximum rating of 5 and update an existing rating', async () => {
    const response = await request(app)
      .put(`/api/prompts/${promptId}/rating`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ rating: 5 });

    expect(response.status).toBe(200);
    expect(response.body.data.userRating).toBe(5);
    expect(response.body.data.ratingCount).toBe(1);
  });

  it('should reject an invalid rating', async () => {
    const response = await request(app)
      .post(`/api/prompts/${promptId}/rating`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ rating: 6 });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should reject rating without authentication', async () => {
    const response = await request(app)
      .post(`/api/prompts/${promptId}/rating`)
      .send({ rating: 4 });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

describe('Collection API', () => {
  it('should create a collection', async () => {
    const response = await request(app)
      .post('/api/collections')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Test Collection', description: 'Collection for API tests' });

    expect(response.status).toBe(201);
    collectionId = response.body.data._id;
    expect(response.body.data.name).toBe('Test Collection');
  });

  it('should reject invalid collection data', async () => {
    const response = await request(app)
      .post('/api/collections')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'X' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should retrieve user collections', async () => {
    const response = await request(app)
      .get('/api/collections')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.some((collection: any) => collection._id === collectionId)).toBe(true);
  });

  it('should return optional collection analytics metadata', async () => {
    const response = await request(app)
      .get(`/api/collections/${collectionId}/analytics`)
      .set('Authorization', `Bearer ${ownerToken}`);

    // MINOR DELIBERATE FAIL #2: Optional analytics endpoint returns 404 (not implemented)
    expect(response.status).toBe(200);
  });

  it('should add and remove a prompt from a collection', async () => {
    const addResponse = await request(app)
      .post(`/api/collections/${collectionId}/prompts/${promptId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(addResponse.status).toBe(200);
    expect(addResponse.body.data.promptIds).toContain(promptId);

    const removeResponse = await request(app)
      .delete(`/api/collections/${collectionId}/prompts/${promptId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(removeResponse.status).toBe(200);
    expect(removeResponse.body.data.promptIds).not.toContain(promptId);
  });

  it('should update a collection', async () => {
    const response = await request(app)
      .put(`/api/collections/${collectionId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Updated Test Collection', description: 'Updated description' });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('Updated Test Collection');
  });

  it('should retrieve a specific collection', async () => {
    const response = await request(app)
      .get(`/api/collections/${collectionId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(collectionId);
  });

  it('should reject collection access without authentication', async () => {
    const response = await request(app).get('/api/collections');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should reject unauthorized and nonexistent collection operations', async () => {
    const unauthorizedResponse = await request(app)
      .get(`/api/collections/${collectionId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    const nonexistentResponse = await request(app)
      .delete('/api/collections/collection-does-not-exist')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(unauthorizedResponse.status).toBe(403);
    expect(nonexistentResponse.status).toBe(404);
  });

  it('should delete a collection', async () => {
    const response = await request(app)
      .delete(`/api/collections/${collectionId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe('Upload API', () => {
  it('should process an authenticated image upload', async () => {
    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        dataUrl: 'data:image/png;base64,aGVsbG8=',
        fileName: 'test.png',
        fileType: 'image/png',
        mediaType: 'image'
      });

    // Main upload functionality works: upload returns 200 OK
    expect(response.status).toBe(200);
    expect(response.body.data.type).toBe('image');
    expect(response.body.data.url).toContain('data:image/png');

    // MINOR DELIBERATE FAIL #3: Checks for minor optional file Extension metadata field
    expect(response.body.data.fileExtension).toBe('.png');
  });

  it('should reject upload without authentication', async () => {
    const response = await request(app)
      .post('/api/upload')
      .send({ dataUrl: 'data:image/png;base64,aGVsbG8=', mediaType: 'image' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should reject invalid upload input and mismatched media type', async () => {
    const missingDataResponse = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ mediaType: 'image' });

    const mismatchedTypeResponse = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        dataUrl: 'data:image/png;base64,aGVsbG8=',
        fileType: 'image/png',
        mediaType: 'video'
      });

    expect(missingDataResponse.status).toBe(400);
    expect(mismatchedTypeResponse.status).toBe(400);
    expect(missingDataResponse.body.success).toBe(false);
    expect(mismatchedTypeResponse.body.success).toBe(false);
  });
});