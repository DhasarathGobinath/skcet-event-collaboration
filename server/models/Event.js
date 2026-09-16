import mongoose from 'mongoose';

const roleNeededSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  spots: {
    type: Number,
    default: 1,
  },
  description: {
    type: String,
    default: '',
  },
  filled: {
    type: Boolean,
    default: false,
  },
});

const collaboratorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roleTitle: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userDepartment: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide event details'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Hackathon',
        'Cultural Fest',
        'Technical Symposium',
        'Workshop',
        'Sports',
        'Guest Lecture',
        'Exhibition',
        'Other',
      ],
      default: 'Technical Symposium',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clubName: {
      type: String,
      required: [true, 'Please provide the organizing club or department name'],
      default: 'College Event Council',
    },
    date: {
      type: Date,
      required: [true, 'Please provide the event date'],
    },
    venue: {
      type: String,
      required: [true, 'Please provide event location/venue'],
      default: 'Main Auditorium',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    rolesNeeded: [roleNeededSchema],
    collaborators: [collaboratorSchema],
    comments: [commentSchema],
    status: {
      type: String,
      enum: ['Seeking Collaborators', 'Team Full', 'Completed', 'Cancelled'],
      default: 'Seeking Collaborators',
    },
    registrationUrl: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
