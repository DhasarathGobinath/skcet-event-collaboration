import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roleTitle: {
      type: String,
      required: true,
    },
    pitch: {
      type: String,
      required: [true, 'Please explain how you can contribute'],
    },
    skills: {
      type: [String],
      default: [],
    },
    portfolioLink: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
