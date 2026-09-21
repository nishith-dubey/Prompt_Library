import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../server';

let app: any;
const primaryUser = {
  name: 'Primary Test User',
  email: `primary-${Date.now()}@example.test`,
  password: 'test-password-123',
  role: 'Student'
};
const secondaryUser = {
  name: 'Secondary Test User',
  email: `secondary-${Date.now()}@example.test`,
  password: 'test-password-456',
  role: 'Developer'
};
let primaryToken: string;
let primaryUserId: string;
let secondaryToken: string;

beforeAll(async () => {
  app = await createApp();
  const primaryResponse = await request(app).post('/api/auth/register').send(primaryUser);
  primaryToken = primaryResponse.body.token;
  primaryUserId = primaryResponse.body.user._id;
  const secondaryResponse = await request(app).post('/api/auth/register').send(secondaryUser);
  secondaryToken = secondaryResponse.body.token;
});

describe('Authentication API', () => {

  it('should register a valid user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Registered Test User',
        email: `registered-${Date.now()}@example.test`,
        password: 'valid-password-123',
        role: 'Researcher'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toContain('@example.test');
  });

  it('should reject duplicate registration email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(primaryUser);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should reject registration with missing or invalid fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        password: 'password123'
      });

    const invalidResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'A',
        email: 'not-an-email',
        password: 'short',
        role: 'Student'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(invalidResponse.status).toBe(400);
    expect(invalidResponse.body.success).toBe(false);
  });

  it('should reject login with a nonexistent user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'definitely-not-a-real-user@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });


  it('should reject login with an incorrect password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: primaryUser.email,
        password: 'definitely-wrong-password'
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });


  it('should reject /me without authentication', async () => {
    const response = await request(app)
      .get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });


  it('should reject /me with an invalid token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });


});

it('should login successfully with valid credentials', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: primaryUser.email,
      password: primaryUser.password
    });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.token).toBeDefined();
  expect(response.body.user).toBeDefined();
  expect(response.body.user.email).toBe(primaryUser.email);
});

it('should access /me with a valid authentication token', async () => {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: primaryUser.email,
      password: primaryUser.password
    });

  const token = loginResponse.body.token;

  const response = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.user.email).toBe(primaryUser.email);
});

it('should reject profile update with invalid profile data', async () => {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: primaryUser.email,
      password: primaryUser.password
    });

  const token = loginResponse.body.token;

  const response = await request(app)
    .put('/api/auth/profile')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: ''
    });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);

  const validResponse = await request(app)
    .put('/api/auth/profile')
    .set('Authorization', `Bearer ${primaryToken}`)
    .send({
      name: 'Updated Test User',
      role: 'Designer',
      bio: 'Updated test biography'
    });

  expect(validResponse.status).toBe(200);
  expect(validResponse.body.success).toBe(true);
  expect(validResponse.body.user.name).toBe('Updated Test User');
});

