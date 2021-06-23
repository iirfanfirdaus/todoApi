const app = require("../app");
const dbHandler = require('./db-handler');
const request = require("supertest");
var token;
var idUser;
var idUser2;
var idUserx;
beforeAll(async () => {
    await dbHandler.connect();

    await request(app)
    .post('/api/v1/user/register')
    .send({
            email: "safira@oct.com",
            name: "safira oct",
            password: "123456"
    });
    await request(app)
    .post('/api/v1/user/register')
    .send({
        email: "saf@oct.com",
        name: "saf oct",
        password: "123456"
    });
    await request(app)
    .post('/api/v1/user/register')
    .send({
        email: "sa@oct.com",
        name: "sa oct",
        password: "123456"
    });

    const res = await request(app)
    .post('/api/v1/auth/login')
    .send({
        email: "safira@oct.com",
        password: "123456"
    });
    token = res.body.data.token;
    idUser = res.body.data.id;
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Login success');

    const resp = await request(app)
    .get('/api/v1/user')
    .set('Authorization', `Bearer ${token}`)
    idUser2 = resp.body.data[1]._id;
    
});


afterAll(async () => {
    await dbHandler.clearDatabase();
    await dbHandler.closeDatabase();
});


describe('User', () => {

    it('tes api', async () => {
        const res = await request(app)
        .get('/')
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Todo API');
    });

    it('get all user', async () => {
        const res = await request(app)
        .get('/api/v1/user')
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User get all data successfully');
    });

    it('not found user - invalid token', async () => {
        const res = await request(app)
        .get('/api/v1/user')
        .set('Authorization', `Bearer 1`)
        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toEqual('Token is not valid');
    });

    it('not found user - no have token', async () => {
        const res = await request(app)
        .get('/api/v1/user')
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Token is missing');
    });

    it('get one user', async () => {
        const res = await request(app)
        .get(`/api/v1/user/${idUser}`)
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User get one data successfully');
    });

    it('not get another user data', async () => {
        const res = await request(app)
        .get(`/api/v1/user/${idUser2}`)
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('You can only get your own data.');
    });

    it('get one user error', async () => {
        const res = await request(app)
        .get(`/api/v1/user/${idUserx}`)
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(500);
    });

    it('get one user not found', async () => {
        const res = await request(app)
        .get(`/api/v1/user/60d30829c5c0893344d0d021`)
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('User not found');
    });

    it('update data success', async () => {
        const res = await request(app)
        .put(`/api/v1/user/${idUser}`)
        .send({
            name: "safira"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Update User safira data successfully');
    });

    it('update failed not found user', async () => {
        const res = await request(app)
        .put(`/api/v1/user/60d30829c5c0893344d0d021`)
        .send({
            name: "safira"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('User not found');
    });

    it('update failed not get another data user', async () => {
        const res = await request(app)
        .put(`/api/v1/user/${idUser2}`)
        .send({
            name: "safira"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('You can only update your own data.');
    });

    it('update user error 500', async () => {
        const res = await request(app)
        .put(`/api/v1/user/${idUserx}`)
        .send({
            name: "safira"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(500);
    });

    it('change password not found user', async () => {
        const res = await request(app)
        .put(`/api/v1/user/changePass/60d30829c5c0893344d0d021`)
        .send({
            oldPassword: "123456",
            newPassword: "1234567"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('User not found');
    });
    

    it('change password failed not get another data user', async () => {
        const res = await request(app)
        .put(`/api/v1/user/changePass/${idUser2}`)
        .send({
            oldPassword: "123456",
            newPassword: "1234567"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('You can only update your own data.');
    });

    it('change password failed incorect old pass', async () => {
        const res = await request(app)
        .put(`/api/v1/user/changePass/${idUser}`)
        .send({
            oldPassword: "1234567",
            newPassword: "1234567"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Incorrect old password');
    });

    it('change password error 500', async () => {
        const res = await request(app)
        .put(`/api/v1/user/changePass/${idUserx}`)
        .send({
            oldPassword: "1234567",
            newPassword: "1234567"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(500);
    });

    it('change password success', async () => {
        const res = await request(app)
        .put(`/api/v1/user/changePass/${idUser}`)
        .send({
            oldPassword: "123456",
            newPassword: "1234567"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Change password successfully');
    });

});