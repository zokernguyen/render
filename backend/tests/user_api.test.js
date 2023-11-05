const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const mongoose = require('mongoose');
const User = require('../models/user');

const testHelper = require('./test_helper');

beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(testHelper.usersList);
});

describe('creating new user', () => {

    test('success with valid username and password', async () => {
        const usersAtStart = await testHelper.loadAllUsers();

        await api
            .post('/api/users')
            .send(testHelper.dummyUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await testHelper.loadAllUsers();

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(testHelper.dummyUser.username);
    });

    test('fail with invalid username/password (<3 chars)', async () => {
        const lazyUser = {
            username: "me",
            name: "I",
            password: "pw"
        };

        await api
            .post('/api/users')
            .send(lazyUser)
            .expect(400)
    });

    test('fail without username/password provided', async () => {
        const absentMindedUser = {
            username: "",
            name: "Err...",
            password: ""
        };

        await api
            .post('/api/users')
            .send(absentMindedUser)
            .expect(400)
        
    });

    test('fail with an already taken username', async () => {
        const doubleganger = {
            username: testHelper.usersList[0].username,
            name: "Unicus Singular Monoman",
            password: "1102"
        };

        await api
            .post('/api/users')
            .send(doubleganger)
            .expect(400)
    });


})

afterAll(async () => {
    await mongoose.connection.close();
});