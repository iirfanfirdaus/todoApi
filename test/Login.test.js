const app = require("../app");
const dbHandler = require('./db-handler');
const request = require("supertest");

beforeAll(async () => {
    await dbHandler.connect();
    await request(app)
    .post('/api/v1/user/register')
    .send({
        email: "safira@oct.com",
        name: "safira oct",
        password: "123456"
    });
});


afterAll(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});


describe('Login', () => {

    it('should success login', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: "safira@oct.com",
            password: "123456"
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Login success');
    });

    it('login must have email', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            password: "123456"
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('celebrate request validation failed');
        expect(res.body.validation.body.message).toEqual('\"email\" is required');
    });

    it('login must have password', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: "safira@oct.com"
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('celebrate request validation failed');
        expect(res.body.validation.body.message).toEqual('\"password\" is required');
    });

    it('login must be valid email', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: "safiraoct.com",
            password: "123456"
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('celebrate request validation failed');
        expect(res.body.validation.body.message).toEqual('\"email\" must be a valid email');
    });

    it('login  password must be min 6 length', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: "safira@oct.com",
            password: "12345"
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('celebrate request validation failed');
        expect(res.body.validation.body.message).toEqual('\"password\" length must be at least 6 characters long');
      });

    it('email not found', async () => {
    const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
        email: "ra@oct.com",
        password: "123456"
        });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('A user with that email not found');
    });

    it('Password not match', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: "safira@oct.com",
            password: "123456x"
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Password not match');
    });

});