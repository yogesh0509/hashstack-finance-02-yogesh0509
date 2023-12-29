const request = require('supertest');
const { app, server } = require('../../app');

afterAll((done) => {
  server.close(done);
});


describe('API Endpoint Test', () => {
  const address1 = "0x13B97ca2361C4649eB254d4d5c2baa89fF3c96a6"
  const address2 = "0x74AfD47aE0Cf11826d8c0F5B4c9f7868c76189aC"

  test('GET /transfers request', async () => {
    const response1 = await request(app).get(`/projectRoutes/transfers/${address1}`);
    expect(response1.status).toBe(200);

    const response2 = await request(app).get(`/projectRoutes/transfers/${address1}`);
    expect(response1.status).toBe(200);
  });

  test('GET /approvals request', async () => {
    const response = await request(app).get(`/projectRoutes/approvals/${address1}`);
    expect(response.status).toBe(200);
    expect(response.body.contract_address).toEqual(address1);
  });

  test('GET /activity request', async () => {
    const response = await request(app).get(`/projectRoutes/activity/${address2}`);
    expect(response.status).toBe(200);
    expect(response.body.contract_address).toEqual(address2);
  });
});
