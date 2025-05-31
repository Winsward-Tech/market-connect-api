import Forum from '../models/forum.model.js';
import Comment from '../models/comment.model.js';

// @desc    Get all forums
// @route   GET /api/forums
// @access  Public
export const getForums = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const forums = await Forum.find(query)
      .populate('author', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name'
        }
      })
      .sort('-createdAt');

    res.json(forums);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Get single forum
// @route   GET /api/forums/:id
// @access  Public
export const getForum = async (req, res, next) => {
  try {
    const forum = await Forum.findById(req.params.id)
      .populate('author', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name'
        }
      });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });      
    }

    res.json(forum);
  } catch (error) {
    res.status(400).json({ message: error.message });   
    next(error);
  }
};

// @desc    Create forum
// @route   POST /api/forums
// @access  Private
export const createForum = async (req, res, next) => {
  try {
    const { title, content, category, tags } = req.body;

    const forum = await Forum.create({
      title,
      content,
      category,
      tags,
      author: req.user._id
    });

    res.status(201).json(forum);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Update forum
// @route   PUT /api/forums/:id
// @access  Private
export const updateForum = async (req, res, next) => {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Check if user is the forum author
    if (forum.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this forum' });
    }

    const updatedForum = await Forum.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedForum);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Delete forum
// @route   DELETE /api/forums/:id
// @access  Private
export const deleteForum = async (req, res, next) => {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Check if user is the forum author
    if (forum.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this forum' });
    }

    // Delete all comments associated with the forum
    await Comment.deleteMany({ forum: req.params.id });
    await forum.deleteOne();

    res.json({ message: 'Forum and associated comments removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Add comment to forum
// @route   POST /api/forums/:forumId/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content, parentComment } = req.body;
    const forum = await Forum.findById(req.params.forumId);

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      forum: req.params.forumId,
      parentComment
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );

    res.json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
}; 