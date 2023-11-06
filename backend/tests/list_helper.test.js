const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const mongoose = require('mongoose');
const Blog = require('../models/blog');

const listHelper = require('../utils/list_helper');
const testHelper = require('./test_helper');

const _ = require('lodash');

let token;

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(testHelper.listWithManyBlogs);

    //login and get token
    const validUsser = {
        username: "Zoker",
        password: 'zoker666'
    }
    const loginRes = await api.post('/api/login').send(validUsser);
    token = loginRes.body.token;
});

describe('GET request', () => {
    test('view all blogs', async () => {

        const response = await api.get('/api/blogs');
        expect(response.body).toHaveLength(testHelper.listWithManyBlogs.length)
    });

    test('each blog must has an unique id', async () => {
        const response = await api.get('/api/blogs');
        const blogsArray = response.body;
        for (let i = 0; i < blogsArray.length; i++) {
            expect(blogsArray[i].id).toBeDefined()
        }
    });

    test('view a blog with a valid id', async () => {
        const allBlogs = await testHelper.loadAllBlogs();
        const blogToView = allBlogs[0];
        const responseBlog = await api.get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(responseBlog.body).toStrictEqual(blogToView);
    });

    test('invalid id return error - blog not found', async () => {
        const mockedId = '5a423b891b54a676234d17fa';
        await api.get(`/api/blogs/${mockedId}`)
            .expect(404)
    })
})

describe('POST requests', () => {

    test('add blog success with a valid blog', async () => {
        const newBlog = testHelper.dummyBlog;

       await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const updatedDB = await testHelper.loadAllBlogs();
        expect(updatedDB).toHaveLength(testHelper.listWithManyBlogs.length + 1);

        const addedBlog = updatedDB[updatedDB.length - 1];
        expect(addedBlog.title).toBe(newBlog.title);
    });

    test('set likes to 0 when adding a blog without likes', async () => {
        const newBlog = testHelper.dummyBlog;

        await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)

        const addedBlog = await testHelper.loadLatestBlog();
        console.log(addedBlog);
        expect(addedBlog.likes).toBe(0);
    });

    test('add blog fail without title/url', async () => {
        const newBlog = {
            author: "Tester404",
            likes: 3
        };

        await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400);
    });

    test('add blog fail if token is not provided', async () => {
        const newBlog = testHelper.dummyBlog;

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })
});

describe('DELETE request', () => {

    test('delete success by using a valid blog id', async () => {
        const allBlogs = await testHelper.loadAllBlogs();

        const blog = {
            title: "Testing delete blog",
            author: "Zoker",
            url: "http://www.zoker.com",
            likes: 5
        };

        //add a new blog for the testing valid user
        await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
            .expect(201);

        //delete new added blog

        const blogToDelete = await Blog.findOne({ title: blog.title });

        const blogId = blogToDelete.toJSON().id;

        await api
            .delete(`/api/blogs/${blogId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const newBlogsList = await testHelper.loadAllBlogs();
        expect(newBlogsList).toHaveLength(allBlogs.length);
        expect(newBlogsList).not.toContainEqual(blogToDelete);
    });

    test('delete fail (404) by using an invalid id', async () => {
        const mockedId = '5a423b891b54a676234d17fa';
        const response = await api.delete(`/api/blogs/${mockedId}`)
            .expect(404)
    });

    test('fail without token provided', async () => {

        await api.delete('/api/blogs/a-random-id')
            .expect(401)
    })
});

describe('PUT requests', () => {

    test('update success by using a valid id', async () => {
        const allBlogs = await testHelper.loadAllBlogs();
        const blogToUpdate = allBlogs[0];
        const newLikes = 666;
        await api.put(`/api/blogs/${blogToUpdate.id}`)
            .send({ ...blogToUpdate, likes: newLikes })
            .expect(200);

        const updatedBlog = await testHelper.loadBlogById(blogToUpdate.id);
        expect(updatedBlog.likes).toBe(newLikes);
    });

    test('update fail (404) by using an invalid id', async () => {
        const mockedId = '5a423b891b54a676234d17fa';
        await api.put(`/api/blogs/${mockedId}`)
            .expect(404)
    });
})

describe('list helper', () => {

    test('when list has only one blog, equals the likes of that',
        () => {
            const result = listHelper.totalLikes(testHelper.listWithOneBlog);
            expect(result).toBe(5);
        });

    test('when list has many blogs, equals the total likes',
        () => {
            const result = listHelper.totalLikes(testHelper.listWithManyBlogs);
            expect(result).toBe(36);
        });

    test('blog with most likes', () => {
        const result = listHelper.favoriteBlog(testHelper.listWithManyBlogs);
        expect(result).toStrictEqual({
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        });
    });

    test('most blogs author', () => {
        const result = listHelper.mostBlogs(testHelper.listWithManyBlogs);
        expect(result).toEqual(
            expect.objectContaining({
                blogs: 3,
            })
        )
    });

    test('most likes author', () => {
        const result = listHelper.mostLikes(testHelper.listWithManyBlogs);
        expect(result).toEqual(
            expect.objectContaining({
                likes: 17,
            })
        )
    });
});

afterAll(async () => {
    await mongoose.connection.close();
})