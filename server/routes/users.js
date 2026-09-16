import express from 'express';
import User from '../models/User.js';
import Event from '../models/Event.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all students / potential collaborators with skill & department filter
router.get('/', async (req, res) => {
  try {
    const { skill, department, search } = req.query;
    let query = {};

    if (department && department !== 'All') {
      query.department = department;
    }

    if (skill) {
      query.skills = { $regex: skill, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile with their organized events and collaborations
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const organizedEvents = await Event.find({ organizer: user._id });
    const collaboratedEvents = await Event.find({
      'collaborators.user': user._id,
      organizer: { $ne: user._id },
    });

    return res.json({
      user,
      organizedEvents,
      collaboratedEvents,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

export default router;
