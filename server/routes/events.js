import express from 'express';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with optional filters (category, search, status)
router.get('/', async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { clubName: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email department avatar')
      .populate('collaborators.user', 'name email department skills avatar')
      .sort({ date: 1 });

    return res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Server error fetching events' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email department year bio avatar')
      .populate('collaborators.user', 'name email department year skills avatar');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({ message: 'Server error fetching event details' });
  }
});

// @route   POST /api/events
// @desc    Create a new event
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      clubName,
      date,
      venue,
      bannerImage,
      rolesNeeded,
      registrationUrl,
      contactEmail,
    } = req.body;

    if (!title || !description || !date || !venue) {
      return res.status(400).json({ message: 'Please provide all required event details' });
    }

    const newEvent = new Event({
      title,
      description,
      category: category || 'Technical Symposium',
      clubName: clubName || 'College Student Chapter',
      date,
      venue,
      bannerImage: bannerImage || '',
      rolesNeeded: rolesNeeded || [],
      registrationUrl: registrationUrl || '',
      contactEmail: contactEmail || req.user.email,
      organizer: req.user._id,
      collaborators: [
        {
          user: req.user._id,
          roleTitle: 'Event Lead / Organizer',
        },
      ],
    });

    const savedEvent = await newEvent.save();
    const populated = await Event.findById(savedEvent._id).populate('organizer', 'name email department');

    return res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ message: 'Server error creating event' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event details (organizer only)
router.put('/:id', protect, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    const {
      title,
      description,
      category,
      clubName,
      date,
      venue,
      bannerImage,
      status,
      rolesNeeded,
      registrationUrl,
      contactEmail,
    } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (clubName) event.clubName = clubName;
    if (date) event.date = date;
    if (venue) event.venue = venue;
    if (bannerImage !== undefined) event.bannerImage = bannerImage;
    if (status) event.status = status;
    if (rolesNeeded) event.rolesNeeded = rolesNeeded;
    if (registrationUrl !== undefined) event.registrationUrl = registrationUrl;
    if (contactEmail !== undefined) event.contactEmail = contactEmail;

    const updatedEvent = await event.save();
    return res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ message: 'Server error updating event' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event (organizer or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    return res.json({ message: 'Event successfully removed' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ message: 'Server error deleting event' });
  }
});

// @route   POST /api/events/:id/comments
// @desc    Add discussion comment / team update
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const comment = {
      user: req.user._id,
      userName: req.user.name,
      userDepartment: req.user.department,
      text: text.trim(),
      createdAt: new Date(),
    };

    event.comments.push(comment);
    await event.save();

    return res.status(201).json(event.comments);
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Server error adding comment' });
  }
});

// @route   POST /api/events/:id/roles
// @desc    Add a new role requirement to an event (organizer only)
router.post('/:id/roles', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify roles' });
    }

    const { title, skills, spots, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Role title is required' });
    }

    event.rolesNeeded.push({
      title,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      spots: spots ? Number(spots) : 1,
      description: description || '',
      filled: false,
    });

    await event.save();
    return res.status(201).json(event.rolesNeeded);
  } catch (error) {
    console.error('Error adding role:', error);
    return res.status(500).json({ message: 'Server error adding role' });
  }
});

export default router;
