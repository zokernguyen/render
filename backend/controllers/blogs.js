const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
        .populate('user', {
            username: 1,
            name: 1,
            id: 1
        })

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

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {

    const user = req.user

    const body = req.body;

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    if (!blog.title || !blog.url) {
        return res.status(400).json({ error: 'title and url are required' });
    }

    const savedBlog = await blog.save();

    //user.blogs is not a plain JS array but is of MongooseDocumentArray, so it cannot be mutated directly without using an expression to re-assign its value.
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res
        .status(201)
        .json(savedBlog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {

    const user = req.user;

    const blogId = req.params.id;
    const blogToDelete = await Blog.findById(blogId);

    if (!blogToDelete) {
        res.status(404).json({ error: 'Blog with given id does not exist' })
    }

    const owner = blogToDelete.user.toString();

    if (user._id.toString() !== owner) {
        return res.status(401).json({ error: "Un-authorized action. You don't have permission to delete other's blog." })
    }

    await Blog.findByIdAndRemove(blogId);

    user.blogs = await user.blogs.filter(id => id.toString() !== blogId);
    await user.save();

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