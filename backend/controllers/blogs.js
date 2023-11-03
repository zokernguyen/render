const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);

});

blogsRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    console.log(res.statusCode)
    if (blog) {
        res.json(blog);
    } else {
        return res.status(404).send(`Blog not found`);
    }
});

blogsRouter.post('/', async (req, res) => {
    const blog = new Blog(req.body);

    if (!blog.title || !blog.url) {
        return res.status(400).end();
    }

    const savedBlog = await blog.save();

    res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const deleteBlog = await Blog.findByIdAndRemove(id);
console.log(deleteBlog);
    if (!deleteBlog) {
        res.status(404).send('Blog with given id does not exist')
    } else if (deleteBlog.errors) {
        res.status(500).send('Database operating error')
    }

    res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
    const id = req.params.id;
    const newLikes = req.body.likes;
    const updateBlog = await Blog.findByIdAndUpdate(id, { likes: newLikes });

    if (!updateBlog) {
        res.status(404).send('Blog with given id does not exist')
    } else if (updateBlog.errors) {
        res.status(500).send('Database operating error')
    }

    res.json(updateBlog);
})

module.exports = blogsRouter;