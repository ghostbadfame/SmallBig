import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: {
    required: [true, "Name field is required."],
    minLength: [2, "Name must be at least 2 characters long."],
    type: Schema.Types.String,
  },
  email: {
    required: [true, "Email field is required."],
    type: Schema.Types.String,
    unique: true,
    trim: true,
  },
  password: {
    type: Schema.Types.String,
  },
  password_reset_token: {
    type: Schema.Types.String,
    trim: true,
  },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);