import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  company?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid email address!`
    }
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true
  },
  country: { 
    type: String, 
    required: [true, 'Country is required'],
    trim: true
  },
  company: { 
    type: String,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Only keep the email uniqueness error handling
UserSchema.post('save', function(error: any, doc: any, next: any) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Email address already exists'));
  } else {
    next(error);
  }
});

export default mongoose.model<IUser>('User', UserSchema); 