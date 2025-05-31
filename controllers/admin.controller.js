import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Forum from '../models/forum.model.js';
import Lesson from '../models/lesson.model.js';
import Comment from '../models/comment.model.js';

// @desc    Get admin dashboard overview
// @route   GET /api/admin/overview
// @access  Private/Admin
export const getOverview = async (req, res, next) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalForums = await Forum.countDocuments();
    const totalLessons = await Lesson.countDocuments();

    // Get user counts by role
    const userCounts = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent activities
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('name phone role createdAt');

    const recentProducts = await Product.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name phone');

    const recentForums = await Forum.find()
      .sort('-createdAt')
      .limit(5)
      .populate('author', 'name phone');

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalForums,
        totalLessons,
        userCounts
      },
      recentActivity: {
        users: recentUsers,
        products: recentProducts,
        forums: recentForums
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get reported content
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getReports = async (req, res, next) => {
  try {
    // Get reported forums
    const reportedForums = await Forum.find({ isReported: true })
      .populate('author', 'name phone')
      .sort('-createdAt');

    // Get reported comments
    const reportedComments = await Comment.find({ isReported: true })
      .populate('author', 'name phone')
      .populate('forum', 'title')
      .sort('-createdAt');

    res.json({
      forums: reportedForums,
      comments: reportedComments
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
}; 