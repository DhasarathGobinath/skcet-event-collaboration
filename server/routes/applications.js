import express from 'express';
import Application from '../models/Application.js';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/applications
// @desc    Apply for a collaboration role on an event
router.post('/', protect, async (req, res) => {
  try {
    const { eventId, roleTitle, pitch, skills, portfolioLink } = req.body;

    if (!eventId || !roleTitle || !pitch) {
      return res.status(400).json({ message: 'Event, role, and pitch are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You are the organizer of this event' });
    }

    // Check if already applied
    const existing = await Application.findOne({
      event: eventId,
      applicant: req.user._id,
      roleTitle,
    });

    if (existing) {
      return res.status(400).json({
        message: 'You have already submitted an application for this role',
      });
    }

    const application = new Application({
      event: eventId,
      applicant: req.user._id,
      roleTitle,
      pitch,
      skills: Array.isArray(skills)
        ? skills
        : skills
        ? skills.split(',').map((s) => s.trim())
        : req.user.skills || [],
      portfolioLink: portfolioLink || '',
      status: 'Pending',
    });

    await application.save();

    const populated = await Application.findById(application._id)
      .populate('event', 'title clubName date venue')
      .populate('applicant', 'name email department year skills');

    return res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating application:', error);
    return res.status(500).json({ message: 'Server error creating application' });
  }
});

// @route   GET /api/applications/my
// @desc    Get all applications submitted by logged-in user
router.get('/my', protect, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('event', 'title clubName date venue category bannerImage status organizer')
      .sort({ createdAt: -1 });

    return res.json(applications);
  } catch (error) {
    console.error('Error fetching my applications:', error);
    return res.status(500).json({ message: 'Server error fetching applications' });
  }
});

// @route   GET /api/applications/event/:eventId
// @desc    Get all applications for a specific event (organizer only)
router.get('/event/:eventId', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view applications for this event' });
    }

    const applications = await Application.find({ event: req.params.eventId })
      .populate('applicant', 'name email department year skills bio phone')
      .sort({ createdAt: -1 });

    return res.json(applications);
  } catch (error) {
    console.error('Error fetching event applications:', error);
    return res.status(500).json({ message: 'Server error fetching event applications' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Accept or reject an application (organizer only)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, feedback } = req.body;

    if (!['Accepted', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid application status' });
    }

    const application = await Application.findById(req.params.id).populate('event');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const event = await Event.findById(application.event._id);
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to review this application' });
    }

    application.status = status;
    if (feedback !== undefined) application.feedback = feedback;
    await application.save();

    // If accepted, check if applicant is already in event collaborators; if not, add them!
    if (status === 'Accepted') {
      const alreadyInTeam = event.collaborators.some(
        (c) => c.user.toString() === application.applicant.toString()
      );

      if (!alreadyInTeam) {
        event.collaborators.push({
          user: application.applicant,
          roleTitle: application.roleTitle,
          joinedAt: new Date(),
        });
        await event.save();
      }
    }

    const updated = await Application.findById(application._id)
      .populate('applicant', 'name email department year skills')
      .populate('event', 'title clubName');

    return res.json(updated);
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({ message: 'Server error updating application status' });
  }
});

export default router;
