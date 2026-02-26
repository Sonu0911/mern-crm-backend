const request  = require('supertest');
const mongoose = require('mongoose');
const app      = require('../src/app');

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('POST /api/auth/signup - should create user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User', email: 'test@example.com', password: 'Password1',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('POST /api/auth/signup - duplicate email should return 409', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User', email: 'test@example.com', password: 'Password1',
    });
    expect(res.status).toBe(409);
  });

  it('POST /api/auth/login - valid credentials should return token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com', password: 'Password1',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('POST /api/auth/login - wrong password should return 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com', password: 'WrongPass',
    });
    expect(res.status).toBe(401);
  });

  it('GET /api/contacts - no token should return 401', async () => {
    const res = await request(app).get('/api/contacts');
    expect(res.status).toBe(401);
  });
});