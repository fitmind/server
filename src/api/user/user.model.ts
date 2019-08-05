import * as mongoose from 'mongoose';

export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  description?: string;
  password: string;
  interestedInExpertiseAreas: string[];
  createdTimeStamp: string;
  approved: boolean;
  rating: number;
  __v: number;
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  password: String,
  interestedInExpertiseAreas: [String],
  createdTimeStamp: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  rating: { type: Number, default: 0 }
});

type UserModelType = UserInterface & mongoose.Document;

const UserModel = mongoose.model<UserModelType>('User', UserSchema);

export default UserModel;
