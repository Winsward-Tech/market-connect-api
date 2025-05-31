import Lesson from '../models/lesson.model.js';

// @desc    Get all lessons
// @route   GET /api/lessons
// @access  Public
export const getLessons = async (req, res, next) => {
  try {
    const { category, language } = req.query;
    let query = { isPublished: true };

    if (category) {
      query.category = category;
    }

    const lessons = await Lesson.find(query)
      .populate('createdBy', 'name phone')
      .sort('-createdAt');

    // Filter by language if specified
    if (language) {
      lessons.forEach(lesson => {
        if (lesson.title.has(language)) {
          lesson.title = lesson.title.get(language);
          lesson.description = lesson.description.get(language);
          if (lesson.content.has(language)) {
            lesson.content = lesson.content.get(language);
          }
        }
      });
    }

    res.json(lessons);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Public
export const getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('createdBy', 'name phone');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // If lesson is not published and user is not admin
    if (!lesson.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized to access this lesson' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private/Admin
export const createLesson = async (req, res, next) => {
  try {
    const { title, description, category, content, duration, difficulty } = req.body;

    const lesson = await Lesson.create({
      title,
      description,
      category,
      content,
      duration,
      difficulty,
      createdBy: req.user._id
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Admin
export const updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
export const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    await lesson.deleteOne();
    res.json({ message: 'Lesson removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
}; 