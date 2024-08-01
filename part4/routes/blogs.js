const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

// Update blog by ID
blogsRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  // Validate the ID
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // Validate the likes field
  if (likes === undefined) {
    return res.status(400).json({ error: 'Likes field is required' });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Update the blog's likes
    blog.likes = likes;
    const updatedBlog = await blog.save();

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = blogsRouter;