import * as mongoose from 'mongoose';

export interface UserInterface extends mongoose.Document {
  _id: string;
  name: string;
  description?: string;
  password: string;
  interestedInExpertiseAreas: String[];
  created: string;
  approved: boolean;
  rating: number;
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  password: String,
  interestedInExpertiseAreas: [String],
  created: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  rating: { type: Number, default: 0 }
});

const UserModel = mongoose.model<UserInterface>('User', UserSchema);

export default UserModel;
