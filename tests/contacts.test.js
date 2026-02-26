const request  = require('supertest');
const mongoose = require('mongoose');
const app      = require('../src/app');

jest.setTimeout(30000);

let token;
let contactId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await request(app).post('/api/auth/signup').send({
    name: 'Test User', email: 'contact@test.com', password: 'Password1',
  });
  const res = await request(app).post('/api/auth/login').send({
    email: 'contact@test.com', password: 'Password1',
  });
  token = res.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('Contacts API', () => {
  it('GET /api/contacts - should return paginated list', async () => {
    const res = await request(app).get('/api/contacts').set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('contacts');
    expect(res.body).toHaveProperty('pagination');
  });

  it('POST /api/contacts - should create contact', async () => {
    const res = await request(app).post('/api/contacts').set(auth()).send({
      name: 'John Doe', email: 'john@test.com', status: 'Lead',
    });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('John Doe');
    contactId = res.body._id;
  });

  it('PUT /api/contacts/:id - should update contact', async () => {
    const res = await request(app).put(`/api/contacts/${contactId}`)
      .set(auth()).send({ status: 'Customer' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Customer');
  });

  it('DELETE /api/contacts/:id - should delete contact', async () => {
    const res = await request(app).delete(`/api/contacts/${contactId}`).set(auth());
    expect(res.status).toBe(200);
  });

  it('GET /api/contacts/:id - deleted contact should return 404', async () => {
    const res = await request(app).get(`/api/contacts/${contactId}`).set(auth());
    expect(res.status).toBe(404);
  });
});