const app = require("../app");
const dbHandler = require('./db-handler');
const request = require("supertest");

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

describe('Register', () => {

    it('should create a new post', async () => {
        const res = await request(app)
          .post('/api/v1/user/register')
          .send({
            email: "safira@oct.com",
            name: "safira oct",
            password: "123456"
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User created successfully');
    });

    it('register must have email', async () => {
        const res = await request(app)
          .post('/api/v1/user/register')
          .send({
            name: "safira oct",
            password: "123456"
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('celebrate request validation failed');
        expect(res.body.validation.body.message).toEqual('\"email\" is required');
    });

    it('register must have name', async () => {
      const res = await request(app)
        .post('/api/v1/user/register')
        .send({
          email: "safira@oct.com",
          password: "123456"
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('celebrate request validation failed');
      expect(res.body.validation.body.message).toEqual('\"name\" is required');
    });

    it('register must have password', async () => {
      const res = await request(app)
        .post('/api/v1/user/register')
        .send({
          email: "safira@oct.com",
          name: "safira oct"
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('celebrate request validation failed');
      expect(res.body.validation.body.message).toEqual('\"password\" is required');
    });

    it('register must be valid email', async () => {
      const res = await request(app)
        .post('/api/v1/user/register')
        .send({
          email: "safiraoct.com",
          name: "safira oct",
          password: "123456"
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('celebrate request validation failed');
      expect(res.body.validation.body.message).toEqual('\"email\" must be a valid email');
    });

    it('register  password must be min 6 length', async () => {
      const res = await request(app)
        .post('/api/v1/user/register')
        .send({
          email: "safira@oct.com",
          name: "safira oct",
          password: "12345"
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('celebrate request validation failed');
      expect(res.body.validation.body.message).toEqual('\"password\" length must be at least 6 characters long');
    });

    it('not create acc if email exists already', async () => {
      await request(app)
        .post('/api/v1/user/register')
        .send({
          email: "safira@oct.com",
          name: "safira oct",
          password: "123456"
        });
      const res = await request(app)
        .post('/api/v1/user/register')
        .send({
          email: "safira@oct.com",
          name: "safira oct",
          password: "123456"
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('A user with that email exists already');
  });

});