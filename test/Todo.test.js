const app = require("../app");
const dbHandler = require('./db-handler');
const request = require("supertest");
var token;
var token2;
var idTodo;
var idTodo2;
var idTodox;
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
            email: "safir@oct.com",
            name: "safir oct",
            password: "123456"
    });

    const resps = await request(app)
    .post('/api/v1/auth/login')
    .send({
        email: "safir@oct.com",
        password: "123456"
    });
    token2 = resps.body.data.token;
    expect(resps.statusCode).toEqual(200);
    expect(resps.body.message).toEqual('Login success');

    await request(app)
    .post('/api/v1/todo')
    .send({
        title: "data 0",
        description: "data isi 0 safira",
        dueDate: "2021-05-31T17:00:00.000Z",
        startDate: "2021-05-31T17:00:00.000Z",
    })
    .set('Authorization', `Bearer ${token2}`)

    const reps = await request(app)
        .get('/api/v1/todo')
        .set('Authorization', `Bearer ${token2}`)
    idTodo2 = reps.body.data[0]._id;

    const res = await request(app)
    .post('/api/v1/auth/login')
    .send({
        email: "safira@oct.com",
        password: "123456"
    });
    token = res.body.data.token;
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Login success');
    
});


afterAll(async () => {
    await dbHandler.clearDatabase();
    await dbHandler.closeDatabase();
});


describe('User', () => {

    it('create todo success', async () => {
        const res = await request(app)
        .post('/api/v1/todo')
        .send({
            title: "data 1",
            description: "data isi 1 safira",
            dueDate: "2021-05-31T17:00:00.000Z",
            startDate: "2021-05-31T17:00:00.000Z",
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Todo created successfully');
    });

    it('get all todo', async () => {
        const res = await request(app)
        .get('/api/v1/todo')
        .set('Authorization', `Bearer ${token}`)
        idTodo = res.body.data[0]._id;
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Todo get all safira oct data successfully');
    });

    it('get one todo', async () => {
        const res = await request(app)
        .get(`/api/v1/todo/${idTodo}`)
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Todo get one safira oct data successfully');
    });

    it('get one todo not found', async () => {
        const res = await request(app)
        .get(`/api/v1/todo/60d30829c5c0893344d0d021`)
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Todo not found');
    });

    it('get one failed get another data user', async () => {
        const res = await request(app)
        .get(`/api/v1/todo/${idTodo2}`)
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('You can only get your own todo.');
    });

    it('get one todo error 500', async () => {
        const res = await request(app)
        .get(`/api/v1/todo/${idTodox}`)
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(500);
    });

    it('update data success', async () => {
        const res = await request(app)
        .put(`/api/v1/todo/${idTodo}`)
        .send({
            title: "tes",
            description: "set"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Update todo safira oct data successfully');
    });

    it('update data not found', async () => {
        const res = await request(app)
        .put(`/api/v1/todo/60d30829c5c0893344d0d021`)
        .send({
            title: "tes",
            description: "set"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Todo not found');
    });

    it('update failed not get another data user', async () => {
        const res = await request(app)
        .put(`/api/v1/todo/${idTodo2}`)
        .send({
            title: "tes",
            description: "set"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('You can only update your own data.');
    });

    it('update todo error 500', async () => {
        const res = await request(app)
        .put(`/api/v1/todo/${idTodox}`)
        .send({
            title: "tes",
            description: "set"
        })
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(500);
    });

    it('delete data success', async () => {
        const res = await request(app)
        .delete(`/api/v1/todo/${idTodo}`)
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Todo Deleted');
    });

    it('delete data not found', async () => {
        const res = await request(app)
        .delete(`/api/v1/todo/60d30829c5c0893344d0d021`)
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Todo not found');
    });

    it('delete failed not get another data user', async () => {
        const res = await request(app)
        .delete(`/api/v1/todo/${idTodo2}`)
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('You can only delete your own todo.');
    });

    it('delete todo error 500', async () => {
        const res = await request(app)
        .delete(`/api/v1/todo/${idTodox}`)
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(500);
    });

});