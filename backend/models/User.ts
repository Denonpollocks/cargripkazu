import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  company: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema); 