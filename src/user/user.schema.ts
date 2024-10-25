import mongoose, { Schema } from 'mongoose';
import { IUser } from './dto/user.interface';

export const UserSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  wallet_balance: {
    type: Number,
    default: 0,
    min: [0, 'Wallet balance cannot be negative'],
  }
});
