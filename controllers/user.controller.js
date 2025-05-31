import User from '../models/user.model.js';

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-pin');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    const { name, phone, location, preferredLanguage } = req.body;
    
    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is updating their own profile or is admin
    if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    // Update user
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.location = location || user.location;
    user.preferredLanguage = preferredLanguage || user.preferredLanguage;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      role: updatedUser.role,
      location: updatedUser.location,
      preferredLanguage: updatedUser.preferredLanguage
    });
  } catch (error) {
    res.status(400).json({ message: error.message });   
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is deleting their own account or is admin
    if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private/Admin
export const getUsersByRole = async (req, res, next) => {
  try {
    const users = await User.find({ role: req.params.role }).select('-pin');
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-pin');
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
}; 