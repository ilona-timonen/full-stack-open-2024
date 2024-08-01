const { describe, test, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: "First Blog",
    author: "Author One",
    url: "http://example.com/first",
    likes: 1,
  },
  {
    title: "Second Blog",
    author: "Author Two",
    url: "http://example.com/second",
    likes: 2,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, 2);
  });

  test('the first blog is about First Blog', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body[0].title, 'First Blog');
  });

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => {
      assert.strictEqual(typeof blog.id, 'string');
      assert.strictEqual(blog._id, undefined);
    });
  });
});

describe('POST /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: "New Blog",
      author: "New Author",
      url: "http://example.com/new",
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map(r => r.title);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);
    assert(titles.includes('New Blog'));
  });
});

after(async () => {
  await mongoose.connection.close();
});