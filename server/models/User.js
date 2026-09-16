import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'organizer', 'admin'],
      default: 'student',
    },
    department: {
      type: String,
      default: 'Computer Science',
    },
    year: {
      type: String,
      default: '3rd Year',
    },
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
