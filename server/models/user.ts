import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  dob: string;

  otp: boolean;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
    required: true,
  },

  otp: {
    type: Boolean,
    default: false,
  },
});

const User = model<IUser>("User", userSchema);
export default User;
