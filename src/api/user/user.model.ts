import * as mongoose from 'mongoose';
import UserInterface from '../../interfaces/user-interface';

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

export type UserModelType = UserInterface & mongoose.Document;

const UserModel = mongoose.model<UserModelType>('User', UserSchema);

export default UserModel;
